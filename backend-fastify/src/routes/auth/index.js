import { registerOpts, signInOpts } from "./options/index.js";
import { register, signIn, googleAuth } from "../../controllers/auth/index.js";

export const authRoutes = function (fastify, opts, done) {
  fastify.post("/register", registerOpts(register));
  fastify.post("/signin", signInOpts(signIn));
  fastify.post("/google", signInOpts(googleAuth))
  done();
};
