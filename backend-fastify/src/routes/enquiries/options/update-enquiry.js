import { enquiryProperties } from "./schema.js";
import {
  responseError,
  responseSuccess,
} from "../../../utils/schema/response.js";

export const updateEnquiryOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        message: "Enquiry updated!",
        data: enquiryProperties,
      }),
      400: responseError(),
      404: responseError({ status: 404 }),
      500: responseError({ status: 500 }),
    },
  },
  handler,
});
