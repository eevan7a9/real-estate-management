import { propertyProperties } from "./schema.js";
import { responseError } from "../../../utils/schema/response.js";

export const getPropertiesOpts = (handler) => ({
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
          data: {
            type: "array",
            items: propertyProperties,
          },
        },
      },
      400: responseError(),
    },
  },
  handler: handler,
});
