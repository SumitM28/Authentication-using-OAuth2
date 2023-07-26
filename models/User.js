import mongoose from "mongoose";

const userScheme = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    loginMethod: {
      type: String,
      enum: ["email", "google", "facebook"],
      required: true,
    },
  },
  { timestamp: true }
);

export default mongoose.model("users", userScheme);
