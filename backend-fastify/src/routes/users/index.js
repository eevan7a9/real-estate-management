import {
  getUsersOpts,
  getUserOpts,
  updateUserOpts,
  getMeOpts,
} from "./options/index.js";
import {
  getUsers,
  getUser,
  getMe,
  updateMe,
} from "../../controllers/users/index.js";

/**
 *
 * @param {import("fastify/types/instance.js").FastifyInstance} fastify
 * @param {Object} opts
 * @param {Function} done
 */
export const usersRoutes = function (fastify, opts, done) {
  fastify.get("/", getUsersOpts(fastify, getUsers));
  fastify.get("/me", getMeOpts(fastify, getMe));
  fastify.get("/:id", getUserOpts(fastify, getUser));
  fastify.patch("/me", updateUserOpts(fastify, updateMe));
  done();
};
