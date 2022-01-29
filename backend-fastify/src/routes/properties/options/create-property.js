import { propertyProperties, defaultError } from "./schema.js";

export const createPropertyOpts = (handler) => ({
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
    },
  },
  handler: handler,
});
