import mongoose, { Schema, Document } from "mongoose";

export interface IPendingUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  gender: "male" | "female" | "other";
  avatar: string;
  otp: string;
}

const pendingUserSchema = new Schema<IPendingUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },

    avatar: {
      type: String,
      required: [true, "Avatar is required"],
    },

    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default pendingUserSchema;