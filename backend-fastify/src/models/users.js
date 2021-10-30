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
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

export const authResponseProperties = {
  id: { type: "string" },
  user_id: { type: "string" },
  email: { type: "string" },
  fullName: { type: "string" },
  accessToken: { type: "string" },
  password: { type: "string" },
};
