import { fastify } from "../../index.js";
import { User } from "../../models/user.js";

export const signIn = async function (req, res) {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });
    if (!foundUser) {
      res.status(404).send({
        statusCode: 404,
        error: "Internal Server Error",
        message: "Error: We can't find a user with that e-mail address.",
      });
    }
    const validPassword = await fastify.bcrypt.compare(
      password,
      foundUser.password
    );
    if (!validPassword) {
      res
        .status(400)
        .send({ message: "Error: Invalid password.", validPassword });
    }
    const { user_id } = foundUser;
    const accessToken = fastify.jwt.sign({ id: user_id });

    res.status(200).send({
      id: foundUser.id,
      user_id: foundUser.user_id,
      fullName: foundUser.fullName,
      email: foundUser.email,
      accessToken,
    });
  } catch (error) {
    res.status(404).send({ message: "Error: Something went wrong." });
  }
};
