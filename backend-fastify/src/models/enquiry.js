import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    enquiry_id: { type: String, required: true },
    content: { type: String, minlength: 10 },
    email: { type: String },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    read: { type: Boolean },
    property: {
      name: { type: String },
      id: { type: String },
    },
    user: {
      from: { type: String, required: true },
      to: { type: Boolean, required: true },
    },
  },
  {
    timestamps: true,
  }
);
export const Enquiry = mongoose.model("Enquiry", enquirySchema);
