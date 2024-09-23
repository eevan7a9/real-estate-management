import { getUsersOpts, getUserOpts } from "./options/index.js";
import { getUsers, getUser, getMe } from "../../controllers/users/index.js";

export const usersRoutes = function (fastify, opts, done) {
  fastify.get("/", getUsersOpts(fastify, getUsers));
  fastify.get("/:id", getUserOpts(fastify, getUser));
  fastify.get("/me", getUserOpts(fastify, getMe));
  done();
};
