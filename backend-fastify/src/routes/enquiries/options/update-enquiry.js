import { enquiryProperties } from "./schema.js";

export const updateEnquiryOpts = (fastify, handler) => ({
  preValidation: [fastify.authenticate],
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
            default: "Success: Enquiry updated!",
          },
          data: enquiryProperties,
        },
      },
    },
  },
  handler,
});
