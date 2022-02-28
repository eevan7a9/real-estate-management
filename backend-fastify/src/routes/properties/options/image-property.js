import { propertyNotFound } from "./schema.js";

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

export const deleteImagesOpts = (handler) => ({
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
            default: "Images are deleted.",
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
