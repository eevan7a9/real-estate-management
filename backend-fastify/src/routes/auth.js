import { register, signIn } from "../controllers/auth.js";
import { authProperties } from "./response/auth.js";

const registerOpts = {
  schema: {
    response: {
      201: authProperties,
    },
  },
  handler: register,
};

const signInOpts = {
  schema: {
    response: {
      200: authProperties,
    },
  },
  handler: signIn,
};

export const authRoutes = function (fastify, opts, done) {
  // Routes for Register
  fastify.post("/register", registerOpts);
  // Routes for Sign In
  fastify.post("/signin", signInOpts);

  done();
};
