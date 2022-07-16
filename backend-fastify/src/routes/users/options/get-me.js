/**
 *  Schema for current user request
 */
import { responseError } from "../../../utils/schema/response.js";
import { meProperties } from "./schema.js";

export const getMeOpts = (handler, fastify) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          status: {
            type: "number",
            default: 200,
          },
          message: {
            type: "string",
            default: "Success",
          },
          data: {
            type: "object",
            properties: meProperties
          },
        },
      },
      400: responseError(),
      404: responseError({ status: 404 }),
    },
  },
  handler: handler,
});
