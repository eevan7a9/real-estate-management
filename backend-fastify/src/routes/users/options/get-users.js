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
      400: {
        type: "object",
        properties: {
          status: {
            type: "number",
            default: 400,
          },
          message: {
            type: "string",
            default: "Something went wrong!",
          },
          error: {
            type: "string",
            default: "Bad Request",
          },
        },
      },
    },
  },
  handler: handler,
});
