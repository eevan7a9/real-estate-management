import { getUsersOpts, getUserOpts } from "./options/index.js";
import { getUsers, getUser, getMe } from "../../controllers/users/index.js";

export const usersRoutes = function (fastify, opts, done) {
  fastify.get("/", getUsersOpts(getUsers, fastify));
  fastify.get("/:id", getUserOpts(getUser, fastify));
  fastify.get("/me", getUserOpts(getMe, fastify));
  done();
};
