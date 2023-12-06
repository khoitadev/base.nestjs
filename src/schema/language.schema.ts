import * as mongoose from 'mongoose';

const languageSchema = new mongoose.Schema(
  {
    locale: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    sort: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true, versionKey: false },
);

languageSchema.index({ locale: 1 }, { unique: true });

export const LanguageSchema = languageSchema;
