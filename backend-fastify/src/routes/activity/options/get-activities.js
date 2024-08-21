import {
  responseError,
  responseSuccess,
} from "../../../utils/schema/response.js";
import { activityProperties } from "./schema.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Function} handler
 */
export const getActivitiesOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "array",
          items: activityProperties,
        },
      }),
      400: responseError(),
    },
  },
  handler: handler,
});
