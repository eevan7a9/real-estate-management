import { User } from "../../models/user.js";
import { removeExpiredNotifications } from "../../services/notification.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const readNotification = async function (req, res) {
  const user_id = req.user.id;
  const param_id = req.body.id;

  try {
    const user = await User.findOne({ user_id }).select("notifications");
    if (!user) {
      return res.status(404).send({ message: "Error: User not found." });
    }
    if (!user.notifications.length) {
      return res.status(404).send({});
    }
    removeExpiredNotifications(user);

    const ids = Array.isArray(param_id) ? param_id : [param_id];
    const updatedNotifications = [];
    ids.forEach((id) => {
      const notification = user.notifications.find(
        (item) => item.notification_id === id && !item.read
      );
      if (notification) {
        notification.read = true;
        updatedNotifications.push(notification);
      }
    });
    if(!updatedNotifications.length) {
      res.status(400).send({ message: "Error: Some or all notifications have already been read." });
    }
    await user.save();
    res.status(200).send({
      status: 200,
      message: "Success: Notification has been set to read!",
      data: updatedNotifications,
    });
  } catch (error) {
    console.log("\n Read notification error:", error)
    res
      .status(400)
      .send({ message: "Error: Something went wrong please try again later." });
  }
};
