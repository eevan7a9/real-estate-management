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
        "USER_LOGOUT",
        "USER_REGISTER",
        "USER_UPDATE",
      ],
      required: true,
    },
    description: { type: String, required: true },
    property_id: { type: String },
    enquiry_id: { type: String },
    user_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model("Activity", activitySchema);
