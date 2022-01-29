import { registerOpts, signInOpts } from "./options/index.js";
import { register, signIn } from "../../controllers/auth/index.js";

export const authRoutes = function (fastify, opts, done) {
  fastify.post("/register", registerOpts(register));
  fastify.post("/signin", signInOpts(signIn));
  done();
};
