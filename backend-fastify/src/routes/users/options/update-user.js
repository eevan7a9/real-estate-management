/**
 *  Schema for multiple users request
 */
import { userProperties } from "./schema.js";
import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {Function} handler
 * @returns
 */
export const updateUserOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: userProperties,
        },
      }),
      400: responseError(),
    },
  },
  handler: handler,
});
