import { User } from "../../models/user.js";
import { removeExpiredNotifications } from "../../services/notification.js";
import { authBearerToken } from "../../utils/requests.js";
import { userIdToken } from "../../utils/users.js";

/**
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 */
export const deleteNotification = async function (req, res) {
  const token = authBearerToken(req);
  const user_id = userIdToken(token);
  const param_id = req.params.id;
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
    /**
     * @type {Array} ids - list of ids to delete
     */
    const ids = param_id.split(",");
    user.notifications = user.notifications.filter((item) => {
      if (ids.length > 1) {
        return !ids.includes(item.notification_id);
      }
      return item.notification_id !== param_id;
    });
    await user.save();

    res.status(200).send({
      status: 200,
      message: "Success: Notification has been deleted!",
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error: Something went wrong please try again later." });
  }
};
