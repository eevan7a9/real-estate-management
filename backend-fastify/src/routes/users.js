import { getUsers } from "../controllers/users.js";
import { getUsersOpts } from "./options/users.js";

export const usersRoutes = function (fastify, opts, done) {
  fastify.get("/", getUsersOpts(getUsers, fastify));
  done();
};
