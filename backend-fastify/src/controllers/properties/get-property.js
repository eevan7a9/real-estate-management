import { Property } from "../../models/property.js";
import { User } from "../../models/user.js";

const ownerProjection = {
  _id: 0,
  user_id: 1,
  fullName: 1,
  role: 1,
  profileImage: 1,
};

/**
 * @param {import("fastify/types/request.js").FastifyRequest} req
 * @param {import("fastify/types/reply.js").FastifyReply} res
 * @returns
 */
export const getProperty = async function (req, res) {
  const { id } = req.params;
  const { slim } = req.query;

  try {
    const visibilityQuery = req.user?.id
      ? { $or: [{ isActive: true }, { user_id: req.user.id }] }
      : { isActive: true };

    const pipeline = [
      {
        $match: {
          property_id: id,
          ...visibilityQuery,
        },
      },
      {
        $lookup: {
          from: User.collection.name,
          let: { ownerId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user_id", "$$ownerId"] },
              },
            },
            { $project: ownerProjection },
          ],
          as: "owner",
        },
      },
      {
        $unwind: {
          path: "$owner",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (slim) {
      pipeline.push({
        $project: {
          _id: 0,
          contactNumber: 0,
          contactEmail: 0,
          position: 0,
          features: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      });
    }

    const [property] = await Property.aggregate(pipeline);

    if (!property) {
      return res.status(404).send({});
    }

    return res.status(200).send({ data: property });
  } catch (error) {
    req.log.error({ err: error }, "Property detail fetch failed");
    return res.status(400).send({
      message: "Error: Something went wrong",
    });
  }
};
