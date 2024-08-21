import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"],
      required: true,
    },
    description: { type: String },
    user_id: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

export const Activity = mongoose.model("Activity", activitySchema);
