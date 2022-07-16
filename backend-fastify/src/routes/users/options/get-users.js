/**
 *  Schema for multiple users request
 */
import { usersProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const getUsersOpts = (handler, fastify) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "array",
          items: {
            type: "object",
            properties: usersProperties,
          }
        }
      }),
      400: responseError(),
    },
  },
  handler: handler,
});
