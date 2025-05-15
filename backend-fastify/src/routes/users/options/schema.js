// multiple users
export const userProperties = {
  user_id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
  about: { type: "string" },
  address: { type: "string" },
  verified: { type: "boolean" },
};
Object.freeze(userProperties);

// single user
export const userDetailProperties = {
  ...userProperties,
  properties: { type: "array" },
  notifications: { type: "array" },
  activities: { type: "array" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
};
Object.freeze(userDetailProperties);
