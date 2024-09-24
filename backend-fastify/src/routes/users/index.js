import { getUsersOpts, getUserOpts, updateUserOpts } from "./options/index.js";
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
  fastify.get("/:id", getUserOpts(fastify, getUser));
  fastify.get("/me", getUserOpts(fastify, getMe));
  fastify.patch("/me", updateUserOpts(fastify, updateMe));
  done();
};
