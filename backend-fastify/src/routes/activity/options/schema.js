export const activityProperties = {
  type: "object",
  properties: {
    id: { type: "string" },
    action: { type: "string" },
    description: { type: "string" },
    user_id: { type: "string" },
    property_id: { type: "string" },
    enquiry_id: { type: "string" },
    createdAt: { type: "string" },
  },
};
Object.freeze(activityProperties);
