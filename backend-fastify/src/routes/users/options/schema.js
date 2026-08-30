// Public user profile fields.
export const userProperties = {
  user_id: { type: "string" },
  fullName: { type: "string" },
  about: { type: "string" },
  address: { type: "string" },
  profileImage: { type: "string" },
};
Object.freeze(userProperties);

// Private, account-safe fields returned only for the authenticated user.
export const privateUserProperties = {
  ...userProperties,
  email: { type: "string" },
  verified: { type: "boolean" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
  properties: { type: "array" },
};
Object.freeze(privateUserProperties);

export const userDetailProperties = privateUserProperties;
