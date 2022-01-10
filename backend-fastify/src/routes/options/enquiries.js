const enquiryProperties = {
  type: "object",
  properties: {
    enquiry_id: { type: "string" },
    content: { type: "string" },
    email: { type: "string" },
    title: { type: "string" },
    topic: { type: "string" },
    read: { type: "boolean" },
    property: {
      type: "object",
      properties: { name: { type: "string" }, id: { type: "string" } },
    },
    user: {
      type: "object",
      properties: { from: { type: "string" }, to: { type: "string" } },
    },
  },
};
Object.freeze(enquiryProperties);

export const getEnquiriesOpts = (handler) => ({
  schema: {
    response: {
      200: {
        type: "array",
        items: enquiryProperties,
      },
    },
  },
  handler,
});

export const getEnquiryOpts = (handler) => ({
  schema: {
    response: {
      200: enquiryProperties,
    },
  },
  handler,
});
