import { enquiryProperties } from "./schema.js";

export const updateEnquiryOpts = (handler) => ({
  schema: {
    response: {
      201: enquiryProperties,
    },
  },
  handler,
});
