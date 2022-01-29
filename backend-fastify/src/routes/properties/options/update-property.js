import { propertyNotFound, propertyProperties } from "./schema.js";

export const updatePropertyOpts = (handler) => ({
  schema: {
    response: {
      201: {
        type: "object",
        properties: {
          status: {
            type: "number",
            default: 201,
          },
          message: {
            type: "string",
            default: "Success",
          },
          data: propertyProperties,
        },
      },
      // ERRORS
      404: propertyNotFound,
    },
  },
  handler: handler,
});

export const uploadImagesOpts = (handler) => ({
  schema: {
    response: {
      201: {
        type: "object",
        properties: {
          status: {
            type: "number",
            default: 201,
          },
          message: {
            type: "string",
            default: "Files are uploaded.",
          },
          data: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      // ERRORS
      404: propertyNotFound,
    },
  },
  handler: handler,
});
