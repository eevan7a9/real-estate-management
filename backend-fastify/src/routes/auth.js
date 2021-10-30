import { register, signIn } from "../controllers/auth.js";
import { authResponseProperties } from "../models/users.js";

const registerOpts = {
  schema: {
    response: {
      201: {
        type: "object",
        properties: authResponseProperties,
      },
    },
  },
  handler: register,
};

const signInOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: authResponseProperties,
      },
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
