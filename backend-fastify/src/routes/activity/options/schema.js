export const activityProperties = {
  type: "object",
  properties: {
    id: { type: "string" },
    user_id: { type: "string" },
    action: { type: "string" },
    description: { type: "string" },
    createdAt: { type: "string" },
  },
};
Object.freeze(activityProperties);
