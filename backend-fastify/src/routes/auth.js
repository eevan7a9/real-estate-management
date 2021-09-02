import { register } from "../controllers/auth.js";

const userProperties = {
  id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
  accessToken: { type: "string" },
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

export const authRoutes = function (fastify, opts, done) {
  // Routes for Register
  fastify.post("/register", registerOpts);

  done();
};
