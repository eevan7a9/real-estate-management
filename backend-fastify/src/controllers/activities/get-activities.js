import { User } from "../../models/user.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const getActivities = async function (req, res) {
  const token = authBearerToken(req);
  const user_id = userIdToken(token);
  const user = await User.findOne({ user_id });

  res.status(200).send({
    status: 200,
    message: "Returns list of activities",
    data: user.activities || []
  });
};
