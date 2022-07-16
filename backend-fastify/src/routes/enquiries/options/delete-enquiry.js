import { enquiryProperties } from "./schema.js";
import { responseSuccess, responseError } from '../../../utils/schema/response.js';

export const deleteEnquiryOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        message: "Enquiry deleted!",
        data: enquiryProperties
      }),
      400: responseError(),
      404: responseError({
        status: 404,
        message: "Can't find Enquiry."
      })
    },
  },
  handler: handler,
});
