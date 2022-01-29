import { propertyNotFound, propertyProperties } from "./schema.js";
export const deletePropertyOpts = (handler) => ({
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
      // ERRORS
      404: propertyNotFound,
    },
  },
  handler: handler,
});
