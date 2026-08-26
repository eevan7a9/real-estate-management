import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { UserAuthProvider } from "../../enums/users.js";
import { addActivity } from "../../services/activity.js";
import { ActivityType } from "../../enums/activity.js";
import { activitySigninDescription } from "../../utils/activity/index.js";

const googleClient = new OAuth2Client();

export const googleAuth = async function (req, res) {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).send({ message: "Error: Invalid request." });
  }

  const audience = process.env.GOOGLE_AUTH_CLIENT_ID;
  if (!audience) {
    req.log.error("GOOGLE_AUTH_CLIENT_ID is not configured");
    return res.status(503).send({ message: "Google sign-in is unavailable." });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience,
    });
    payload = ticket.getPayload();
  } catch (error) {
    req.log.warn({ err: error }, "Rejected invalid Google ID token");
    return res.status(401).send({ message: "Invalid Google credential." });
  }

  const { sub, email, name: fullName, email_verified: emailVerified } = payload || {};
  if (!sub || !email || !fullName || !emailVerified) {
    return res.status(401).send({ message: "Invalid Google credential." });
  }

  try {
    let user = await User.findOne({ googleId: sub });

    if (!user) {
      const normalizedEmail = email.toLowerCase();
      const existingEmailUser = await User.exists({ email: normalizedEmail });
      if (existingEmailUser) {
        return res.status(409).send({
          message: "An account already exists with this email. Please sign in using its existing method.",
        });
      }

      user = await new User({
        user_id: uuidv4(),
        fullName,
        email: normalizedEmail,
        googleId: sub,
        authProvider: UserAuthProvider.google,
      }).save();
    }

    const accessToken = fastify.jwt.sign({ id: user.user_id });

    addActivity(user, {
      action: ActivityType.user.login,
      description: activitySigninDescription(user, UserAuthProvider.google),
      user_id: user.user_id,
    });
    await user.save();

    return res.status(200).send({
      data: {
        id: user.id,
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        accessToken,
      },
    });
  } catch (error) {
    req.log.error({ err: error }, "Google sign-in failed");
    return res.status(500).send({ message: "Error: Something went wrong." });
  }
};
