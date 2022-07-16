/**
 *  Schema for current user request
 */
import { meProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";


export const getMeOpts = (handler, fastify) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: meProperties
        }
      }),
      400: responseError(),
      404: responseError({ status: 404 }),
    },
  },
  handler: handler,
});
