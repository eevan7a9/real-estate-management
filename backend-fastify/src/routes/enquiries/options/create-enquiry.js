import { enquiryProperties } from "./schema.js";
import { responseSuccess, responseError } from '../../../utils/schema/response.js';

export const createEnquiryOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      201: responseSuccess({
        status: 201,
        message: 'Enquiry created!',
        data: enquiryProperties
      }),
      400: responseError(),
    },
  },
  handler,
});
