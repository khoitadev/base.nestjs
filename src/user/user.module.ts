import { Module, Global } from '@nestjs/common';
import { UserService } from '~/user/user.service';
import { UserController } from '~/user/user.controller';

@Global()
@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
