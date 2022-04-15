import { propertyProperties } from "./schema.js";
import { responseError } from "../../../utils/schema/response.js";

export const createPropertyOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      201: {
        type: "object",
        properties: {
          status: {
            type: "number",
            default: 201,
          },
          message: {
            type: "string",
            default: "Success: Property created!",
          },
          data: propertyProperties,
        },
      },
      400: responseError({
        status: 400,
        message: "Error: Something went wrong, please try again later."
      }),
      401: responseError({
        status: 401,
        message: "No Authorization was found in request.headers",
      }),
    },
  },
  handler: handler,
});
