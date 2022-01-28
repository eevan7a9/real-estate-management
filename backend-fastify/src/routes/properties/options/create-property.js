import { propertyProperties } from "./schema.js";

export const createPropertyOpts = (handler) => ({
  schema: {
    response: {
      201: propertyProperties,
    },
  },
  handler: handler,
});
