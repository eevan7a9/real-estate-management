import { enquiryProperties } from "./schema.js";

export const getEnquiriesOpts = (handler) => ({
  schema: {
    response: {
      200: {
        type: "array",
        items: enquiryProperties,
      },
    },
  },
  handler,
});
