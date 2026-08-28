import { ContactSubmissionTopic } from "../../../enums/contact-submissions.js";

export const contactSubmissionResponse = {
  type: "object",
  properties: {
    submission_id: { type: "string" },
    createdAt: { type: "string" },
  },
};

export const createContactSubmissionBody = {
  type: "object",
  required: ["name", "email", "message"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1, maxLength: 120 },
    email: { type: "string", format: "email" },
    topic: { type: "string", enum: Object.values(ContactSubmissionTopic) },
    message: { type: "string", minLength: 10, maxLength: 2000 },
    property: {
      type: "object",
      required: ["property_id"],
      additionalProperties: false,
      properties: { property_id: { type: "string", minLength: 1 } },
    },
  },
};
