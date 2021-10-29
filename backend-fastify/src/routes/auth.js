import { register, signIn } from "../controllers/auth.js";
import { userAuthResponse } from "../models/users.js";

const registerOpts = {
  schema: {
    response: {
      201: {
        type: "object",
        properties: userAuthResponse,
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
        properties: userAuthResponse,
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
