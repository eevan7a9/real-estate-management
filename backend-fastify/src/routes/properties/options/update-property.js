export const updatePropertyOpts = (handler) => ({
  schema: {
    response: {
      201: {
        type: "object",
        properties: {
          message: { type: "string" },
          property_id: { type: "string" },
        },
      },
    },
  },
  handler: handler,
});
