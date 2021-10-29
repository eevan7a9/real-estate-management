import { v4 as uuidv4 } from "uuid";
import { users } from "../dummy-data/users.js";
import { fastify } from "../index.js";
import { User } from "../models/users.js";

export const register = async function (req, res) {
  const { fullName, email, password } = req.body;
  if (fullName && email && password) {
    try {
      const hashedPassword = await fastify.bcrypt.hash(password);
      const newUser = new User({
        user_id: uuidv4(),
        fullName,
        email,
        password: hashedPassword,
      });
      const { user_id } = await newUser.save();
      const accessToken = fastify.jwt.sign({ id: newUser.user_id });
      res.status(201).send({ user_id, email, fullName, accessToken });
    } catch (error) {
      res.send(error);
    }
  }
  res.status(400).send({ message: "Error: form is invalid" });
};

export const signIn = async function (req, res) {
  const { email, password } = req.body;
  const foundUser = users.find((user) => user.email === email);
  if (foundUser) {
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
  }
  res.status(404).send({ message: "Error: Invalid email." });
};
