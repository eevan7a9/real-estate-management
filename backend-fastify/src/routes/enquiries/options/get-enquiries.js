import { enquiryProperties } from "./schema.js";
import { responseError } from '../../../utils/schema/response.js';

export const getEnquiriesOpts = (handler) => ({
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
            items: enquiryProperties,
          },
        },
      },
      400: responseError()
    },
  },
  handler,
});
