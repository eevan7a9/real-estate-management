import { propertyProperties } from "./schema.js";

export const getPropertyOpts = (handler) => ({
  schema: {
    response: {
      200: propertyProperties,
    },
  },
  handler: handler,
});
