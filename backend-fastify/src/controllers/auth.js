import { v4 as uuidv4 } from "uuid";
import { fastify } from "../index.js";
import { User } from "../models/user.js";

export const register = async function (req, res) {
  const { fullName, email, password } = req.body;
  if (fullName && email && password) {
    try {
      const hashedPassword = await fastify.bcrypt.hash(password);
      const newUser = new User({
        user_id: uuidv4(),
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
      const { user_id } = await newUser.save();
      const accessToken = fastify.jwt.sign({ id: newUser.user_id });
      res
        .status(201)
        .send({ user_id, email: email.toLowerCase(), fullName, accessToken });
    } catch (error) {
      res.send(error);
    }
  }
  res.status(400).send({ message: "Error: form is invalid" });
};

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
    const { id } = foundUser;
    const accessToken = fastify.jwt.sign({ id });

    res.status(200).send({
      id: foundUser.id,
      fullName: foundUser.fullName,
      email: foundUser.email,
      accessToken,
    });
  } catch (error) {
    res.status(404).send({ message: "Error: Something went wrong." });
  }
};
