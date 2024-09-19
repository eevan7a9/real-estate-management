export const notificationProperties = {
  type: "object",
  properties: {
    notification_id: { type: "string" },
    message: { type: "string" },
    type: { type: "string" },
    read: { type: "boolean" },
    expiresAt: { type: "string" },
  },
};

Object.freeze(notificationProperties);
