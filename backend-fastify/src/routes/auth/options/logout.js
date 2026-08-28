import { responseSuccess } from "../../../utils/schema/response.js";

export const logoutOpts = (handler) => ({
  schema: {
    response: {
      200: responseSuccess({ message: "Success: User is now logged out." }),
    },
  },
  handler,
});
