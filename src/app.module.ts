import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { LanguageService } from '~/language/language.service';
import { LanguageController } from '~/language/language.controller';
import { LanguageModule } from '~/language/language.module';
import { UserModule } from '~/user/user.module';
import { DatabaseModule } from '~/database/database.module';
import { LoggerMiddleware } from '~/middleware/logger.middleware';
import { AuthModule } from '~/auth/auth.module';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { AuthGuard } from '~/auth/guard/auth.guard';
import { FileModule } from '~/file/file.module';
import { FileService } from '~/file/file.service';
import { FileController } from '~/file/file.controller';
import { AdminController } from '~/admin/admin.controller';
import { AdminService } from '~/admin/admin.service';
import { AdminModule } from '~/admin/admin.module';
import { EmailModule } from '~/email/email.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LanguageModule,
    UserModule,
    AuthModule,
    FileModule,
    AdminModule,
    EmailModule,
  ],
  controllers: [
    AppController,
    AuthController,
    LanguageController,
    FileController,
    AdminController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
    AuthService,
    AdminService,
    LanguageService,
    FileService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('language');
  }
}
