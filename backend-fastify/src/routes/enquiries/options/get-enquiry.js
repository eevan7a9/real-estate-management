import { enquiryProperties } from "./schema.js";

export const getEnquiryOpts = (handler) => ({
  schema: {
    response: {
      200: enquiryProperties,
    },
  },
  handler,
});
