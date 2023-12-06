import { Document } from 'mongoose';
import { ObjectId } from 'mongoose';
import { Status } from '~/enum';

export interface User extends Document {
  readonly _id: ObjectId;
  readonly name: string;
  readonly email: string;
  password: string;
  avatar?: string;
  phone?: string;
  emailVerified: string;
  language: string;
  typeLogin?: string;
  uid?: string;
  countryCode?: string;
  ip?: string;
  status: Status;
}

export interface UpdateInfoSocial {
  typeLogin?: string;
  uid?: string;
  name?: string;
}
