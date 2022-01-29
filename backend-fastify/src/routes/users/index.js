import { getUsersOpts } from "./options/index.js";
import { getUsers } from "../../controllers/users/index.js";

export const usersRoutes = function (fastify, opts, done) {
  fastify.get("/", getUsersOpts(getUsers, fastify));
  done();
};
