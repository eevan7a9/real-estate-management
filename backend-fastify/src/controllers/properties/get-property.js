import { Property } from "../../models/property.js";

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getProperty = async function (req, res) {
  const { id } = req.params;
  const { slim } = req.query;

  try {
    const projection = slim
      ? {
          _id: 0,
          enquiries: 0,
          contactNumber: 0,
          contactEmail: 0,
          position: 0,
          features: 0,
          createdAt: 0,
          updatedAt: 0,
        }
      : {};

    const property = await Property.findOne({ property_id: id })
      .select(projection)
      .lean();

    if (!property) {
      return res.status(404).send({});
    }

    return res.status(200).send({ data: property });
  } catch (error) {
    console.error(error);
    return res.status(400).send({
      message: "Error: Something went wrong",
    });
  }
};
