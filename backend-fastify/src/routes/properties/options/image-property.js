import { responseError } from "../../../utils/schema/response.js";

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
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
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
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});
