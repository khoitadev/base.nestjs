import * as mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

otpSchema.index({ createdAt: 1 }, { expires: 180 });

export const OtpSchema = otpSchema;
