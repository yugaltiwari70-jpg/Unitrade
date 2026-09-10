const mongoose = require("mongoose");

const pendingSignupSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    college: {
      type: String,
      default: "",
    },

    course: {
      type: String,
      default: "",
    },

    otpHash: {
      type: String,
      required: true,
    },

    otpExpiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

pendingSignupSchema.index(
  { otpExpiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
  "PendingSignup",
  pendingSignupSchema
);