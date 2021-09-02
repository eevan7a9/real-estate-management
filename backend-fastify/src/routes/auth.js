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
};

export const authRoutes = function (fastify, opts, done) {
  // Routes for Register
  fastify.post("/register", registerOpts, (req, res) => {
    res.status(200).send({
      id: "string",
      email: "string",
      fullName: "string",
      accessToken: "string",
    });
  });

  done();
};
