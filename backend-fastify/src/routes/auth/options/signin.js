import { responseError, responseSuccess } from "../../../utils/schema/response.js";
import { authProperties } from "./schema.js";

export const signInOpts = (handler) => ({
  schema: {
    response: {
      200: responseSuccess({
        data: authProperties,
        message: "Success: User is now logged in",
      }),
      400: responseError(),
      401: responseError({ status: 401, message: "Invalid Google credential." }),
      404: responseError({ status: 404 }),
      409: responseError({ status: 409 }),
      500: responseError({ status: 500 }),
      503: responseError({ status: 503, message: "Google sign-in is unavailable." })
    },
  },
  handler: handler,
});
