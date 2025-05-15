export const authProperties = {
  type: "object",
  properties: {
    user_id: { type: "string" },
    email: { type: "string" },
    fullName: { type: "string" },
    accessToken: { type: "string" },
    about: { type: "string" },
    address: { type: "string" },
    verified: { type: "boolean" }
  },
};
Object.freeze(authProperties);
