import { ActivityType } from "../../enums/activity.js";
import { createActivity as create } from "../../services/activity.js";
/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const createActivity = async function (req, res) {
  await create('cf44e61c-160e-411c-8f7f-ee1580cc8fa5', ActivityType.delete, 'Delete Property');
  res.status(201).send({
    status: 201,
    message: "Activity Created",
  });
};
