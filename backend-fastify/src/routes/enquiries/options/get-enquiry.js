import { enquiryProperties } from "./schema.js";
import { responseSuccess, responseError } from '../../../utils/schema/response.js';

export const getEnquiryOpts = (handler) => ({
  schema: {
    response: {
      200: responseSuccess({ data: enquiryProperties }),
      400: responseError(),
      404: responseError({ status: 404, message: "Error: Can't find Enquiry." })
    },
  },
  handler,
});
