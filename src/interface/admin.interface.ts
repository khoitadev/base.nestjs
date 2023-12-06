import { Document } from 'mongoose';
import { ObjectId } from 'mongoose';
import { Status } from '~/enum';

export interface Admin extends Document {
  readonly _id: ObjectId | string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string[];
  readonly status: Status;
}
