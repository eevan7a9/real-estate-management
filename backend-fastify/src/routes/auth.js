import { register, signIn } from "../controllers/auth.js";

const userProperties = {
  id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
  accessToken: { type: "string" },
  password: { type: "string" },
};

const registerOpts = {
  schema: {
    response: {
      201: {
        type: "object",
        properties: userProperties,
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
        properties: userProperties,
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
