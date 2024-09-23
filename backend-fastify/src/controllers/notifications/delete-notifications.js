import { User } from "../../models/user.js";
import { removeExpiredNotifications } from "../../services/notification.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const deleteNotification = async function (req, res) {
  const user_id = req.user.id;
  const ids = req.body.id;
  try {
    const user = await User.findOne({ user_id }).select("notifications");
    if (!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    if (!user.notifications.length) {
      return res
        .status(400)
        .send({ message: "Error: User notifications are empty." });
    }
    removeExpiredNotifications(user);
    user.notifications = user.notifications.filter((item) => {
      if (Array.isArray(ids)) {
        return !ids.includes(item.notification_id);
      }
      return item.notification_id !== ids;
    });
    await user.save();

    res.status(200).send({
      status: 200,
      message: "Success: Notification has been deleted!",
    });
  } catch (error) {
    console.log("\n Delete Error:", error)
    res
      .status(400)
      .send({ message: "Error: Something went wrong please try again later." });
  }
};
