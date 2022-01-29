import { propertyProperties } from "./schema.js";

export const getPropertiesOpts = (handler) => ({
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
            type: "array",
            items: propertyProperties,
          },
        },
      },
    },
  },
  handler: handler,
});
