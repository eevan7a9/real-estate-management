import { v4 as uuidv4 } from "uuid";
import { fastify } from "../../index.js";
import { User } from "../../models/user.js";
import { isPasswordValid } from "../../utils/users.js";

/**
 * Registers a new user.
 * @async
 * @param {import('fastify').FastifyRequest} req - The Fastify request object.
 * @param {import('fastify').FastifyReply<Response>} res - The Fastify response object.
 * @returns {Promise<import('fastify').FastifyReply<Response>>} A promise that resolves to the Fastify response object.
 */
export const register = async function (req, res) {
  const { fullName, email, password } = req.body;
  if (fullName && email && password) {
    if(!isPasswordValid(password)) {
      return res.status(400).send({ message: "Error: password is not valid" })
    }
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
      return res
        .status(201)
        .send({ user_id, email: email.toLowerCase(), fullName, accessToken });
    } catch (error) {
      return res.send(error);
    }
  }
  return res.status(400).send({ message: "Error: form is invalid" });
};
