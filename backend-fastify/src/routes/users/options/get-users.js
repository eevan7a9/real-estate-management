/**
 *  Schema for multiple users request
 */
import { userProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const getUsersOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "array",
          items: {
            type: "object",
            properties: userProperties,
          }
        }
      }),
      400: responseError(),
    },
  },
  handler: handler,
});
