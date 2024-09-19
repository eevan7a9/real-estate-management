import { responseSuccess, responseError } from '../../../utils/schema/response.js';

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Function} handler
 */
export const readNotificationOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        message: "Notification is read!",
      }),
      400: responseError(),
      404: responseError({
        status: 404,
        message: "Can't find Notification."
      })
    },
  },
  handler: handler,
});
