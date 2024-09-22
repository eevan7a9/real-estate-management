import {
  responseError,
  responseSuccess,
} from "../../../utils/schema/response.js";
import { notificationProperties } from "./schema.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Function} handler
 */
export const getNotificationsOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "array",
          items: notificationProperties,
        },
      }),
      400: responseError(),
    },
  },
  handler: handler,
});
