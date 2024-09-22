import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const notificationSchema = new mongoose.Schema(
  {
    notification_id: { type: String, default: () => uuidv4(), unique: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["ACCOUNT", "ENQUIRY", "PROPERTY", "SYSTEM"],
      required: true,
    },
    read: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false }
);

export { notificationSchema };
