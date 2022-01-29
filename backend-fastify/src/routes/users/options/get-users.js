import { userProperties } from "./schema.js";

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
