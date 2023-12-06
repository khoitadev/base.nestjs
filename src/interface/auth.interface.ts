import { ObjectId } from 'mongoose';
import { Request } from 'express';

export interface ReqAuth extends Request {
  readonly user: DataAuth;
  readonly userId: ObjectId;
}

export interface DataAuth {
  readonly email: string;
  readonly id: ObjectId;
  readonly role?: string[];
  readonly iat: number;
  readonly exp: number;
}

export interface ReqRegister {
  readonly clientIp?: string;
  readonly clientCountry?: string;
}
