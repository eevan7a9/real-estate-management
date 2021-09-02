import { getUsers } from "../controllers/users.js";

const userProperties = {
  id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
};

const getUsersOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: userProperties,
        },
      },
    },
  },
  handler: getUsers,
};

export const usersRoutes = function (fastify, opts, done) {
  // Routes for Register
  fastify.get("/", getUsersOpts);

  done();
};
