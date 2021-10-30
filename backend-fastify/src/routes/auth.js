import { register, signIn } from "../controllers/auth.js";
import { registerOpts, signInOpts } from "./options/auth.js";

export const authRoutes = function (fastify, opts, done) {
  fastify.post("/register", registerOpts(register));
  fastify.post("/signin", signInOpts(signIn));
  done();
};
