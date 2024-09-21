import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";
import { notificationProperties } from "./schema.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Function} handler
 */
export const readNotificationOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    body: {
      type: "object",
      properties: {
        id: {
          anyOf: [
            { type: "string" },
            { type: "array", items: { type: "string" } },
          ],
        },
      },
      required: ["id"],
    },
    response: {
      200: responseSuccess({
        message: "Notification is read!",
        data: {
          type: "array",
          items: notificationProperties,
        },
      }),
      400: responseError(),
      404: responseError({
        status: 404,
        message: "Can't find Notification.",
      }),
    },
  },
  handler: handler,
});
