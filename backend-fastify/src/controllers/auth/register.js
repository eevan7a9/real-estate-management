import { v4 as uuidv4 } from "uuid";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";

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
