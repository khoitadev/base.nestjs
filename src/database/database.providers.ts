import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { AdminSchema } from '~/schema/admin.schema';
import { UserSchema } from '~/schema/user.schema';
import { LanguageSchema } from '~/schema/language.schema';
import { EmailSchema } from '~/schema/email-template';
import { OtpSchema } from '~/schema/otp.schema';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      const dbUrl = process.env.DB_URL;
      mongoose.set('strictQuery', true);
      return mongoose.connect(dbUrl);
    },
    inject: [ConfigService],
  },
  {
    provide: 'ADMIN_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('admin', AdminSchema, 'admin'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('user', UserSchema, 'user'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'LANGUAGE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('language', LanguageSchema, 'language'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'EMAIL_TEMPLATE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('email_template', EmailSchema, 'email_template'),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'OTP_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('otp', OtpSchema, 'otp'),
    inject: ['DATABASE_CONNECTION'],
  },
];
