import { deleteNotification, getNotifications, readNotification } from "../../controllers/notifications/index.js";
import { deleteNotificationOpts } from "./options/delete-enquiry.js";
import { getNotificationsOpts } from "./options/get-notifications.js";
import { readNotificationOpts } from "./options/read-notification.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} opts
 * @param {Function} done
 */
export const notificationsRoutes = function (fastify, opts, done) {
  fastify.get("/", getNotificationsOpts(fastify, getNotifications));
  fastify.patch("/:id", readNotificationOpts(fastify, readNotification));
  fastify.delete("/:id", deleteNotificationOpts(fastify, deleteNotification));

  done();
};
