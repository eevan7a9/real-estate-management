import { propertyNotFound, propertyProperties } from "./schema.js";

export const getPropertyOpts = (handler) => ({
  schema: {
    response: {
      // SUCCESS
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
          data: propertyProperties,
        },
      },
      // ERRORS
      404: propertyNotFound,
    },
  },
  handler: handler,
});
