const userProperties = {
  user_id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
};
Object.freeze(userProperties);

export const getUsersOpts = (handler, fastify) => ({
  preValidation: [fastify.authenticate],
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
  handler: handler,
});
