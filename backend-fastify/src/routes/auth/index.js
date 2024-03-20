import { registerOpts, signInOpts, changePasswordOpts } from "./options/index.js";
import { register, signIn, googleAuth, changePassword } from "../../controllers/auth/index.js";

export const authRoutes = function (fastify, opts, done) {
  fastify.post("/register", registerOpts(register));
  fastify.post("/signin", signInOpts(signIn));
  fastify.post("/google", signInOpts(googleAuth))
  fastify.post("/change-password", changePasswordOpts(changePassword, fastify))
  done();
};
