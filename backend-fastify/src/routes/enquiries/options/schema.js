const property = {
  type: "object",
  properties: {
    name: { type: "string" },
    property_id: { type: "string" }
  },
};
Object.freeze(property);

const users = {
  type: "object",
  properties: {
    from: {
      user_id: { type: "string" },
      keep: { type: "boolean" }
    },
    to: {
      user_id: { type: "boolean" },
      keep: { type: "boolean" }
    }
  },
};
Object.freeze(users);

const replyTo = {
  type: "object",
  properties: {
    enquiry_id: { type: "string" },
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
    replyTo,
    users,
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};
Object.freeze(enquiryProperties);
