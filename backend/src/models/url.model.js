import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
      maxlength: [2048, "URL cannot exceed 2048 characters"],
    },

    shortCode: {
      type: String,
      required: [true, "Short code is required"],
      unique: true,
      trim: true,
      minlength: [4, "Short code must contain at least 4 characters"],
      maxlength: [30, "Short code cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Short code can contain only letters, numbers, hyphens and underscores",
      ],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    lastAccessedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Efficiently fetch a user's newest links
urlSchema.index({ user: 1, createdAt: -1 });

export const Url = mongoose.model("Url", urlSchema);