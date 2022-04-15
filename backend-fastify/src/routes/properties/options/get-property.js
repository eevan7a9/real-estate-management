import { propertyProperties } from "./schema.js";
import { responseError } from "../../../utils/schema/response.js";

export const getPropertyOpts = (handler) => ({
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
            default: "Success",
          },
          data: propertyProperties,
        },
      },
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});
