import { Property } from "../../models/property.js";

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req 
 * @param {import("fastify/types/reply.js").FastifyReply} res 
 * @returns 
 */
export const getProperties = async function (_, res) {
  const properties = await Property.find();
  return res.status(200).send({ data: properties });
};

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req 
 * @param {import("fastify/types/reply.js").FastifyReply} res 
 * @returns 
 */
export const getMyProperties = async function (req, res) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(400).send({ message: "Invalid request missing user id" });
  }
  try {
    const properties = await Property.find({ user_id });
    return res.status(200).send({
      data: properties
    });
  } catch (error) {
    console.error("\n", error);
    return res.status(500).send({ message: "Error: Something went wrong" });
  }
};