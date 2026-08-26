import { enquiryProperties } from "./schema.js";
import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";

export const getEnquiryOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({ data: enquiryProperties }),
      400: responseError(),
      404: responseError({
        status: 404,
        message: "Error: Can not find enquiry.",
      }),
      500: responseError({ status: 500 }),
    },
  },
  handler,
});
