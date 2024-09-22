import { deleteNotification, getNotifications, readNotification } from "../../controllers/notifications/index.js";
import { deleteNotificationOpts } from "./options/delete-notifications.js";
import { getNotificationsOpts } from "./options/get-notifications.js";
import { readNotificationOpts } from "./options/read-notification.js";
// import { NotificationType, SocketNotificationType } from "../../enums/notifications.js";
// import { User } from "../../models/user.js";
// import { addNotification } from "../../services/notification.js";
// import { authBearerToken } from "../../utils/requests.js";
// import { userIdToken } from "../../utils/users.js";
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
  /**
   *
  fastify.post("/", {
    preValidation: [fastify.authenticate],
    handler: async function (req, res) {
      const token = authBearerToken(req);
      const user_id = userIdToken(token);
      const user = await User.findOne({ user_id });

      const notification = addNotification(user, {
        type: NotificationType.account,
        message: "This notification should be removed after 7 days",
        // message: "This notification should be removed after 3 min",
      });
      sendTargetedNotification(SocketNotificationType.user, notification, user.user_id);
      await user.save();

      return res.status(200).send({
        data: user,
      });
    },
  });  
  */
  done();
};
