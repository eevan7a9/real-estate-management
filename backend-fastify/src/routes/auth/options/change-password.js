import {responseError, responseSuccess} from "../../../utils/schema/response.js";

export const changePasswordOpts = (handler, fastify) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess(),
      400: responseError(),
      404: responseError({ status: 404 })
    },
  },
  handler: handler,
});
