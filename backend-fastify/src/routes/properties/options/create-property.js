import { propertyProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const createPropertyOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      201: responseSuccess({
        status: 201,
        message: "Property created!",
        data: propertyProperties
      }),
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
