import { authProperties } from "./schema.js";

export const registerOpts = (handler) => ({
  schema: {
    response: {
      201: authProperties,
    },
  },
  handler: handler,
});
