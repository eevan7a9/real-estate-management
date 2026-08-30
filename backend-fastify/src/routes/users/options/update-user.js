/**
 *  Schema for multiple users request
 */
import { privateUserProperties, userProperties } from "./schema.js";
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

export const uploadProfileImageOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        message: "Success: profile image uploaded.",
        data: { type: "object", properties: privateUserProperties },
      }),
      400: responseError(),
      401: responseError({ status: 401 }),
      404: responseError({ status: 404 }),
      413: responseError({ status: 413 }),
      500: responseError({ status: 500 }),
    },
  },
  handler,
});
