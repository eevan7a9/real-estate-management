import { User } from "../../models/user.js";
import { removeExpiredNotifications } from "../../services/notification.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const getNotifications = async function (req, res) {
  const user_id = req.user.id;
  try {
    const user = await User.findOne({ user_id }).select("notifications");
    if (!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    if (user.notifications.length) {
      const hasExpired = removeExpiredNotifications(user);
      if (hasExpired) {
        await user.save();
      }
    }
    return res.status(200).send({
      status: 200,
      message: "Returns list of Notifications",
      data: user?.notifications || [],
    });
  } catch (error) {
    res
      .status(400)
      .send({
        message: "Error: Something went wrong, Please try again later.",
      });
  }
};
