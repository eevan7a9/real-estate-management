import {
  registerOpts,
  signInOpts,
  changePasswordOpts,
  refreshOpts,
  logoutOpts,
} from "./options/index.js";
import {
  register,
  signIn,
  googleAuth,
  changePassword,
  refresh,
  logout,
} from "../../controllers/auth/index.js";

export const authRoutes = function (fastify, opts, done) {
  fastify.post("/register", registerOpts(register));
  fastify.post("/signin", signInOpts(signIn));
  fastify.post("/google", signInOpts(googleAuth));
  fastify.post("/change-password", changePasswordOpts(changePassword, fastify));
  fastify.post("/refresh", refreshOpts(refresh));
  fastify.post("/logout", logoutOpts(logout));
  done();
};
