/**
 *  Schema for single user request
 */
import { userDetailProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const getUserOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: userDetailProperties
        }
      }),
      400: responseError(),
      404: responseError({ status: 404 }),
    },
  },
  handler: handler,
});
