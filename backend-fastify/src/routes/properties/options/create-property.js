import {
  propertyProperties,
  defaultError,
  unauthorizedError,
} from "./schema.js";

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
      400: defaultError,
      401: unauthorizedError,
    },
  },
  handler: handler,
});
