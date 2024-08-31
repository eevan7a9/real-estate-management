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

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      minlength: 4,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      unique: true,
    },
    password: {
      type: String,
    },
    properties: {
      type: Array,
    },
    activities: {
      type: [activitySchema],
      validate: [arrayLimit, "{PATH} exceeds the limit of activities per user"],
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length <= process.env.USER_ACTIVITIES_MAX || 20;
}

export const User = mongoose.model("User", userSchema);
