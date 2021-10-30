export const authProperties = {
  type: "object",
  properties: {
    id: { type: "string" },
    user_id: { type: "string" },
    email: { type: "string" },
    fullName: { type: "string" },
    accessToken: { type: "string" },
  },
};
Object.freeze(authProperties);
