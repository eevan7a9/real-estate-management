export const deletePropertyOpts = (handler) => ({
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          property_id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  },
  handler: handler,
});
