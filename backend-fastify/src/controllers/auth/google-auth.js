import { fastify } from "../../index.js";
import { User } from "../../models/user.js";

export const googleAuth = async function (req, res) {
  /**
   *  we Validate if google client id's exist & match with our google auth client id
   *  we decoded JWT token from google API to get user information
   *  https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
   */
  const { clientId, client_id, credential } = req.body;
  const authClientId = clientId || client_id;
  if (!authClientId || !credential) {
    return res.status(400).send({ message: "Error: Invalid request." });
  }
  if (process.env.GOOGLE_AUTH_CLIENT_ID != authClientId) {
    return res.status(400).send({ message: "Error: Invalid client Id." });
  }
  const { sub, email, name: fullName, picture } = fastify.jwt.decode(credential);
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
