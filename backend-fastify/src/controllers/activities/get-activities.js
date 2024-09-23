import { User } from "../../models/user.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const getActivities = async function (req, res) {
  const user_id = req.user.id;
  const user = await User.findOne({ user_id }).select("activities -_id").lean();
  
  res.status(200).send({
    status: 200,
    message: "Returns list of activities",
    data: user.activities || []
  });
};
