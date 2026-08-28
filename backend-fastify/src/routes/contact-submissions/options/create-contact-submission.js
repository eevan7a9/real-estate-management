import {
  contactSubmissionResponse,
  createContactSubmissionBody,
} from "./schema.js";
import {
  responseError,
  responseSuccess,
} from "../../../utils/schema/response.js";

export const createContactSubmissionOpts = (fastify, handler) => ({
  preValidation: [fastify.optionalAuthenticate],
  schema: {
    body: createContactSubmissionBody,
    response: {
      201: responseSuccess({
        status: 201,
        message: "Contact submission received!",
        data: contactSubmissionResponse,
      }),
      400: responseError(),
      404: responseError({ status: 404 }),
      500: responseError({ status: 500 }),
    },
  },
  handler,
});
