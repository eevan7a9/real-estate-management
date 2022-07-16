import { responseSuccess, responseError } from "../../../utils/schema/response.js";

export const uploadImagesOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
  schema: {
    response: {
      201: responseSuccess({
        status: 201,
        message: "Files are uploaded.",
        data: {
          type: "array",
          items: {
            type: "string",
          },
        }
      }),
      400: responseError(),
      401: responseError({
        status: 401,
        message: "No Authorization was found in request.headers"
      }),
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});

export const deleteImagesOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
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
      400: responseError(),
      401: responseError({
        status: 401,
        message: "No Authorization was found in request.headers"
      }),
      404: responseError({
        status: 404,
        message: "Error: Property not found!",
      }),
    },
  },
  handler: handler,
});
