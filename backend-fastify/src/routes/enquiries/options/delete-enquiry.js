import { enquiryProperties } from "./schema.js";
import { responseError } from '../../../utils/schema/response.js';

export const deleteEnquiryOpts = (handler) => ({
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
            default: "Success: Enquiry deleted!",
          },
          data: enquiryProperties,
        },
      },
      404: responseError({
        status: 404,
        message: "Error: Can't find Enquiry."
      })
    },
  },
  handler: handler,
});
