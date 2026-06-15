import * as mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: 'active', //close
    },
  },
  { timestamps: true, versionKey: false },
);

adminSchema.index({ email: 1 }, { unique: true });

export const AdminSchema = adminSchema;
