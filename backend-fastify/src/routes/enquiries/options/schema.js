const property = {
  type: "object",
  properties: { name: { type: "string" }, id: { type: "string" } },
};
Object.freeze(property);

const user = {
  type: "object",
  properties: { from: { type: "string" }, to: { type: "string" } },
};
Object.freeze(user);

const replyTo = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    topic: { type: "string" },
  },
};
Object.freeze(replyTo);

export const enquiryProperties = {
  type: "object",
  properties: {
    enquiry_id: { type: "string" },
    content: { type: "string" },
    email: { type: "string" },
    title: { type: "string" },
    topic: { type: "string" },
    read: { type: "boolean" },
    property,
    user,
    replyTo,
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};
Object.freeze(enquiryProperties);
