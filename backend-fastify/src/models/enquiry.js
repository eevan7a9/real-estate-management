import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  property_id: { type: String },
  name: { type: String },
});

const usersSchema = new mongoose.Schema({
  from: {
    user_id: { type: String },
    keep: { type: Boolean, default: true, required: true }
  },
  to: {
    user_id: { type: String },
    keep: { type: Boolean, default: true, required: true }
  }
});

const replyToSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  topic: { type: String },
});

const enquirySchema = new mongoose.Schema(
  {
    enquiry_id: { type: String, required: true },
    content: { type: String, minlength: 10 },
    email: { type: String },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    read: { type: Boolean, default: false },
    property: propertySchema,
    replyTo: replyToSchema,
    users: usersSchema
  },
  {
    timestamps: true,
  }
);
export const Enquiry = mongoose.model("Enquiry", enquirySchema);
