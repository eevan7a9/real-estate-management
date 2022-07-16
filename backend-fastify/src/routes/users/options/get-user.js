/**
 *  Schema for single user request
 */
import { userProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const getUserOpts = (handler, fastify) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: userProperties
        }
      }),
      400: responseError(),
      404: responseError({ status: 404 }),
    },
  },
  handler: handler,
});
