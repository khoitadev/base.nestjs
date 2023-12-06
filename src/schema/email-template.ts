import * as mongoose from 'mongoose';

const emailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    keyword: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: {},
      required: true,
    },
    status: {
      type: String,
      default: 'active',
      required: false,
    },
    sort: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true, versionKey: false },
);

emailSchema.index({ keyword: 1 }, { unique: true });

export const EmailSchema = emailSchema;
