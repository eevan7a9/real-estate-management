import { usersRoutes } from "./users/index.js";
import { authRoutes } from "./auth/index.js";
import { propertiesRoutes } from "./properties/index.js";
import { enquiriesRoutes } from "./enquiries/index.js";
import { activitiesRoutes } from "./activity/index.js";
import { notificationsRoutes } from "./notifications/index.js";
import { contactSubmissionsRoutes } from "./contact-submissions/index.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 */
export const setFastifyRoutes = function (fastify) {
  fastify.get("/", async (req, reply) => {
    console.log("GET Request at base '/'");
    return {
      success: true,
      message:
        "Welcome to the Real Estate API. Please refer to the documentation for available endpoints.",
    };
  });
  fastify.register(usersRoutes, { prefix: "/users" });
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(propertiesRoutes, { prefix: "/properties" });
  fastify.register(enquiriesRoutes, { prefix: "/enquiries" });
  fastify.register(activitiesRoutes, { prefix: "/activities" });
  fastify.register(notificationsRoutes, { prefix: "/notifications" });
  fastify.register(contactSubmissionsRoutes, {
    prefix: "/contact-submissions",
  });
};
