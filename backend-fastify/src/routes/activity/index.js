import { getActivities } from "../../controllers/activities/index.js";
import { getActivitiesOpts } from "./options/index.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Object} opts
 * @param {Function} done
 */
export const activitiesRoutes = function (fastify, opts, done) {
  fastify.get("/", getActivitiesOpts(fastify, getActivities));
  done();
};
