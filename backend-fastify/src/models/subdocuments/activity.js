import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "ENQUIRY_NEW",
        "ENQUIRY_DELETE",
        "PROPERTY_NEW",
        "PROPERTY_DELETE",
        "PROPERTY_UPDATE",
        "USER_LOGIN",
        "USER_REGISTER",
        "USER_UPDATE",
      ],
      required: true,
    },
    description: { type: String, required: true },
    property_id: { type: String },
    enquiry_id: { type: String },
  },
  {
    _id: false,
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

export { activitySchema };
