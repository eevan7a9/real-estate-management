/**
 *  Schema for single user request
 */
import { responseError } from "../../../utils/schema/response.js";
import { userProperties } from "./schema.js";

export const getUserOpts = (handler, fastify) => ({
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
            properties: userProperties
          },
        },
      },
      400: responseError(),
      404: responseError({ status: 404 }),
    },
  },
  handler: handler,
});
