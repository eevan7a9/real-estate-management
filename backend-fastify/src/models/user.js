import mongoose from "mongoose";
import { activitySchema } from "./subdocuments/activity.js";
import { notificationSchema } from "./subdocuments/notification.js";
import { UserAuthProvider } from "../enums/users.js";

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      minlength: 4,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+@.+\..+/,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows many documents without this field
    },
    authProvider: {
      type: String,
      enum: [UserAuthProvider.local, UserAuthProvider.google],
      default: UserAuthProvider.local,
    },
    password: {
      type: String,
    },
    properties: {
      type: Array,
    },
    activities: {
      type: [activitySchema],
      validate: [
        arrayLimitActivities,
        "{PATH} exceeds the limit of activities per user",
      ],
    },
    notifications: {
      type: [notificationSchema],
      validate: [
        arrayLimitNotifications,
        "{PATH} exceeds the limit of notifications per user",
      ],
    },
    about: {
      type: String,
      maxlength: [1000, "About cannot exceed 1000 characters"],
    },
    address: {
      type: String,
      maxlength: [300, "Address cannot exceed 300 characters"],
    },
    profileImage: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
    googleAuth: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

function arrayLimitActivities(val) {
  return val.length <= process.env.USER_ACTIVITIES_MAX || 20;
}

function arrayLimitNotifications(val) {
  return val.length <= process.env.USER_NOTIFICATIONS_MAX || 20;
}

export const User = mongoose.model("User", userSchema);
