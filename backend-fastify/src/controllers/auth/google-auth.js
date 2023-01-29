import { fastify } from "../../index.js";
import { User } from "../../models/user.js";

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
  const { sub, email, name: fullName, aud, iss, exp, picture } = fastify.jwt.decode(credential);

  if (process.env.GOOGLE_AUTH_CLIENT_ID !== aud) {
    // Invalid client id && invalid
    return res.status(400).send({ message: "Error: Invalid Request." });
  }
  if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
    // Source is invalid
    return res.status(400).send({ message: "Error: Invalid Request." });
  }
  if (exp < new Date().getTime() / 1000) {
    // Token is expired
    return res.status(400).send({ message: "Error: Invalid Request." });
  }

  const foundUser = await User.findOne({ user_id: sub });
  let id = foundUser?.id;
  let accessToken = '';

  if (!foundUser) {
    /**
     *  IF user is not found. 
     *  Google Sign-in for the first time, we create a new user
     */
    console.log("Google Sign-in creating new user...")
    const newUser = new User({
      user_id: sub,
      fullName,
      email: email.toLowerCase(),
    });
    const user = await newUser.save();
    id = user.id;
  }
  accessToken = fastify.jwt.sign({ id: sub });
  res.status(200).send({
    id,
    user_id: sub,
    fullName,
    email,
    accessToken,
  });
}
