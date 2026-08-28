import mongoose from "mongoose";
import { ContactSubmissionTopic } from "../enums/contact-submissions.js";

const propertySnapshotSchema = new mongoose.Schema(
  {
    property_id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false },
);

const contactSubmissionSchema = new mongoose.Schema(
  {
    submission_id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    topic: {
      type: String,
      required: true,
      enum: Object.values(ContactSubmissionTopic),
      default: ContactSubmissionTopic.general,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    user_id: { type: String },
    property: { type: propertySnapshotSchema },
  },
  {
    timestamps: true,
    collection: "contact_submissions",
  },
);

export const ContactSubmission = mongoose.model(
  "ContactSubmission",
  contactSubmissionSchema,
);
