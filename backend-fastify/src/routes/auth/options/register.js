import { authProperties } from "./schema.js";
import { responseSuccess } from "../../../utils/schema/response.js";

export const registerOpts = (handler) => ({
  schema: {
    response: {
      201: responseSuccess({
        data: authProperties,
        message: "Success: User is now registered",
      }),
    },
  },
  handler: handler,
});
