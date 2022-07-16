import { propertyProperties } from "./schema.js";
import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const getPropertyOpts = (handler) => ({
  schema: {
    response: {
      200: responseSuccess({ data: propertyProperties }),
      400: responseError(),
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});
