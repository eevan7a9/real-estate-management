import { enquiryProperties } from "./schema.js";

export const createEnquiryOpts = (handler) => ({
  schema: {
    response: {
      201: enquiryProperties,
    },
  },
  handler,
});
