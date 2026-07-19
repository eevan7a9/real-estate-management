import { propertyProperties, propertyPopupProperties } from "./schema.js";
import {
  responseSuccess,
  responseError,
} from "../../../utils/schema/response.js";

export const getPropertyOpts = (handler) => ({
  schema: {
    querystring: {
      type: "object",
      properties: {
        slim: {
          type: "boolean",
          default: false,
        },
      },
    },
    response: {
      200: responseSuccess({
        data: {
          oneOf: [propertyProperties, propertyPopupProperties],
        },
      }),
      400: responseError(),
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});
