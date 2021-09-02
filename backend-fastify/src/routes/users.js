import { users } from "../dummy-data/users.js";

const userProperties = {
  id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
  accessToken: { type: "string" },
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
};

export const usersRoutes = function (fastify, opts, done) {
  // Routes for Register
  fastify.get("/", getUsersOpts, (req, res) => {
    res.status(200).send(users);
  });

  done();
};
