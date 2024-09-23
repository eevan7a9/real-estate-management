import { Property } from "../../models/property.js";

/**
 * 
 * @param {import("fastify/types/request.js").FastifyRequest} req 
 * @param {import("fastify/types/reply.js").FastifyReply} res 
 * @returns 
 */
export const getProperty = async function (req, res) {
  const { id } = req.params;
  try {
    const property = await Property.findOne({ property_id: id });
    if(!property) {
      return res.status(404).send({});
    }
    return res.status(200).send({ data: property });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      message: "Error: Something went wrong"
    });
  }
};
