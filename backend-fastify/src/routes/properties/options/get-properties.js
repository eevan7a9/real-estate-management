import { propertyProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const getPropertiesOpts = (handler) => ({
  schema: {
    response: {
      200: responseSuccess({
        data: {
          type: "array",
          items: propertyProperties,
        }
      }),
      400: responseError(),
    },
  },
  handler: handler,
});
