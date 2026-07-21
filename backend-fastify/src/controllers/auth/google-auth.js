import { v4 as uuidv4 } from "uuid";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { UserAuthProvider } from "../../enums/users.js";
import { addActivity } from "../../services/activity.js";
import { ActivityType } from "../../enums/activity.js";
import { activitySigninDescription } from "../../utils/activity/index.js";

export const googleAuth = async function (req, res) {
  /**
   *  we Validate if google client id's exist & match with our google auth client id
   *  we decoded JWT token from google API to get user information
   *  https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
   */
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).send({ message: "Error: Invalid request." });
  }
  const decoded = fastify.jwt.decode(credential);
  console.log("\n\nDecoded credential:", decoded);
  const { aud, iss, exp, sub, email, name: fullName } = decoded;

  if (process.env.GOOGLE_AUTH_CLIENT_ID !== aud) {
    console.log(
      "\nInvalid audience: \n",
      aud,
      process.env.GOOGLE_AUTH_CLIENT_ID,
    );
    return res.status(400).send({
      message: "Invalid audience",
      expected: process.env.GOOGLE_AUTH_CLIENT_ID,
      actual: aud,
    });
  }

  if (iss !== "accounts.google.com" && iss !== "https://accounts.google.com") {
    console.log("\nInvalid issuer\n", iss);
    return res.status(400).send({
      message: "Invalid issuer",
      issuer: iss,
    });
  }

  if (exp < Date.now() / 1000) {
    console.log("\nInvalid token, expired\n", exp);
    return res.status(400).send({
      message: "Expired token",
      exp,
    });
  }

  let user = await User.findOne({ googleId: sub });

  if (!user) {
    console.log("\nGoogle Sign-in creating new user...\n");

    user = await new User({
      user_id: uuidv4(),
      fullName,
      email: email.toLowerCase(),
      googleId: sub,
      authProvider: UserAuthProvider.google,
    }).save();
  }

  const accessToken = fastify.jwt.sign({
    id: user.user_id,
  });

  // We log as User activity
  addActivity(user, {
    action: ActivityType.user.login,
    description: activitySigninDescription(user, UserAuthProvider.google),
    user_id: user.user_id,
  });

  return res.status(200).send({
    data: {
      id: user.id,
      user_id: user.user_id,
      fullName: user.fullName,
      email: user.email,
      accessToken,
    },
  });
};
