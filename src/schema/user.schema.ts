import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      required: false,
      default: '',
    },
    phone: {
      type: String,
      required: false,
      default: '',
    },
    language: {
      type: String,
      default: 'vi',
    },
    status: {
      type: String,
      required: false,
      default: 'active', //delete
    },
    typeLogin: {
      type: String,
      required: false,
      default: 'default',
    },
    uid: {
      type: String,
      required: false,
      default: '',
    },
    countryCode: {
      type: String,
      required: false,
      default: 'VN',
    },
    ip: {
      type: String,
      required: false,
      default: '127.0.0.1',
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.index({ email: 1 }, { unique: true });

export const UserSchema = userSchema;
