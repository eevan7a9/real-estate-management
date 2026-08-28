import {
  responseError,
  responseSuccess,
} from "../../../utils/schema/response.js";

export const refreshOpts = (handler) => ({
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "object",
          properties: { accessToken: { type: "string" } },
        },
      }),
      401: responseError({
        status: 401,
        message: "Invalid or expired refresh token.",
      }),
    },
  },
  handler,
});
