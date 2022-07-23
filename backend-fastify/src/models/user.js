import mongoose from "mongoose";

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
      required: true,
    },
    properties: {
      type: Array,
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
