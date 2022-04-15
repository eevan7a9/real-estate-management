import { propertyProperties } from "./schema.js";
import { responseError } from "../../../utils/schema/response.js";

export const deletePropertyOpts = (handler) => ({
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          status: {
            type: "number",
            default: 200,
          },
          message: {
            type: "string",
            default: "Success: Property deleted!",
          },
          data: propertyProperties,
        },
      },
      400: responseError({
        status: 400,
        message: "Error: Something went wrong, please try again later."
      }),
      // ERRORS
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});
