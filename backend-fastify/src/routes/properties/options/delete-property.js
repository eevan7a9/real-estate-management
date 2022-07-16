import { propertyProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const deletePropertyOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        message: "Property deleted!",
        data: propertyProperties
      }),
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
