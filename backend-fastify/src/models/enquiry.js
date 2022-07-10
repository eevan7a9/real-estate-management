import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const replyToSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  topic: { type: String },
})

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
    user: userSchema,
    replyTo: replyToSchema,
  },
  {
    timestamps: true,
  }
);
export const Enquiry = mongoose.model("Enquiry", enquirySchema);
