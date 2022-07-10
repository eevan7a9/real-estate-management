/**
 *  Schema for multiple users request
 */
import { responseError } from "../../../utils/schema/response.js";
import { usersProperties } from "./schema.js";

export const getUsersOpts = (handler, fastify) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: usersProperties,
        },
      },
      400: responseError(),
    },
  },
  handler: handler,
});
