/**
 *  Schema for single user request
 */
import { publicProfileProperties } from "./schema.js";
import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";

export const getUserOpts = (fastify, handler) => ({
  schema: {
    querystring: {
      type: "object",
      properties: {
        excludePropertyId: { type: "string" },
      },
    },
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: publicProfileProperties,
        },
      }),
      400: responseError(),
      404: responseError({ status: 404 }),
      500: responseError({ status: 500 }),
    },
  },
  handler: handler,
});
