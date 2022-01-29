import { authProperties } from "./schema.js";

export const signInOpts = (handler) => ({
  schema: {
    response: {
      200: authProperties,
    },
  },
  handler: handler,
});
