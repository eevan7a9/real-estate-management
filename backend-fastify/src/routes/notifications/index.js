import { deleteNotification, getNotifications } from "../../controllers/notifications/index.js";
import { deleteNotificationOpts } from "./options/delete-enquiry.js";
import { getNotificationsOpts } from "./options/get-notifications.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} opts
 * @param {Function} done
 */
export const notificationsRoutes = function (fastify, opts, done) {
  fastify.get("/", getNotificationsOpts(fastify, getNotifications));
  fastify.delete("/:id", deleteNotificationOpts(fastify, deleteNotification));
  done();
};
