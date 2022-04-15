import { enquiryProperties } from "./schema.js";
import { responseError } from '../../../utils/schema/response.js';

export const createEnquiryOpts = (handler) => ({
  schema: {
    response: {
      201: {
        type: "object",
        properties: {
          status: {
            type: "number",
            default: 201,
          },
          message: {
            type: "string",
            default: "Success: Enquiry created!",
          },
          data: enquiryProperties,
        },
      },
      400: responseError(),
    },
  },
  handler,
});
