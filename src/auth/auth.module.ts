import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '~/admin/admin.module';
import { AuthService } from '~/auth/auth.service';
import { AuthController } from '~/auth/auth.controller';

@Module({
  imports: [
    AdminModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
