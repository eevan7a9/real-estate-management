import {
  deleteNotification,
  getNotifications,
  readNotification,
} from "../../controllers/notifications/index.js";
import { deleteNotificationOpts } from "./options/delete-notifications.js";
import { getNotificationsOpts } from "./options/get-notifications.js";
import { readNotificationOpts } from "./options/read-notification.js";

// import { NotificationType, SocketNotificationType } from "../../enums/notifications.js";
// import { User } from "../../models/user.js";
// import { addNotification } from "../../services/notification.js";
// import { sendTargetedNotification } from "../../websocket/index.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} opts
 * @param {Function} done
 */
export const notificationsRoutes = function (fastify, opts, done) {
  fastify.get("/", getNotificationsOpts(fastify, getNotifications));
  fastify.patch("/", readNotificationOpts(fastify, readNotification));
  fastify.delete("/", deleteNotificationOpts(fastify, deleteNotification));

  // fastify.post("/", {
  //   preValidation: [fastify.authenticate],
  //   handler: async function (req, res) {
  //     const user_id = req.user.id;
  //     const user = await User.findOne({ user_id });
  //     if (!user) {
  //       return res.status(404).send({ message: "Error: User not found." });
  //     }

  //     const notification = addNotification(user, {
  //       type: NotificationType.account,
  //       message: "This notification should be removed after 7 days",
  //       // message: "This notification should be removed after 3 min",
  //     });
  //     sendTargetedNotification(SocketNotificationType.user, notification, user.user_id);
  //     await user.save();

  //     return res.status(200).send({
  //       data: user,
  //     });
  //   },
  // });
  done();
};
