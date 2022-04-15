import { propertyProperties } from "./schema.js";
import { responseError } from "../../../utils/schema/response.js";

export const deletePropertyOpts = (fastify, handler) => ({
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
            default: "Success: Property deleted!",
          },
          data: propertyProperties,
        },
      },
      400: responseError(),
      401: responseError({
        status: 401,
        message: "No Authorization was found in request.headers"
      }),
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});
