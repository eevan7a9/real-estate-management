import { privateUserProperties } from "./schema.js";
import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";

export const getMeOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      200: responseSuccess({
        data: { type: "object", properties: privateUserProperties },
      }),
      404: responseError({ status: 404 }),
      500: responseError({ status: 500 }),
    },
  },
  handler,
});
