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
      match:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
      default: 'active', //detele
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
