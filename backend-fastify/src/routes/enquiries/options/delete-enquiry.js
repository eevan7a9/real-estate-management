export const deleteEnquiryOpts = (handler) => ({
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          enquiry_id: { type: "string" },
          title: { type: "string" },
        },
      },
    },
  },
  handler: handler,
});
