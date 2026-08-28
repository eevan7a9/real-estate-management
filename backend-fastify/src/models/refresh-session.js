import mongoose from "mongoose";

const refreshSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    selector: {
      type: String,
      required: true,
      unique: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    lastUsedAt: {
      type: Date,
      required: true,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    ipAddress: {
      type: String,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
    collection: "refresh_sessions",
  },
);

export const RefreshSession = mongoose.model(
  "RefreshSession",
  refreshSessionSchema,
);
