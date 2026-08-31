import mongoose from "mongoose";
import { activitySchema } from "./subdocuments/activity.js";
import { notificationSchema } from "./subdocuments/notification.js";
import { UserAuthProvider } from "../enums/users.js";

const publicLinkField = () => ({
  type: String,
  trim: true,
  maxlength: [500, "A profile link cannot exceed 500 characters"],
  validate: {
    validator(value) {
      if (!value) return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    message: "Profile links must be valid HTTP(S) URLs",
  },
});

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
      type: [String],
      default: [],
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
      default: false,
    },
    role: {
      type: String,
      enum: ["owner", "agent", "broker"],
      default: "owner",
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [150, "Business name cannot exceed 150 characters"],
    },
    licenseNumber: {
      type: String,
      trim: true,
      maxlength: [100, "License number cannot exceed 100 characters"],
    },
    publicLocation: {
      city: {
        type: String,
        trim: true,
        maxlength: [100, "City cannot exceed 100 characters"],
      },
      region: {
        type: String,
        trim: true,
        maxlength: [100, "Region cannot exceed 100 characters"],
      },
      country: {
        type: String,
        trim: true,
        maxlength: [100, "Country cannot exceed 100 characters"],
      },
    },
    links: {
      website: publicLinkField(),
      facebook: publicLinkField(),
      instagram: publicLinkField(),
      linkedin: publicLinkField(),
      x: publicLinkField(),
      youtube: publicLinkField(),
      tiktok: publicLinkField(),
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, "Phone number cannot exceed 30 characters"],
    },
    showPhone: {
      type: Boolean,
      default: false,
    },
    showEmail: {
      type: Boolean,
      default: false,
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
