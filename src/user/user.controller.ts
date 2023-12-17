import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import {
  CreateUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
  VerifyEmailDto,
} from '~/dto';
import { UserService } from '~/user/user.service';
import { User } from '~/interface';
import { Public } from '~/auth/decorators/public.decorator';
import { AuthGuard } from '~/auth/guard/auth.guard';
import { ReqAuth } from '~/interface';
import { Role } from '~/auth/decorators/role.decorator';
import { RoleAuth } from '~/enum';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('list')
  async list(): Promise<User[]> {
    return await this.userService.list();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() req: ReqAuth) {
    return await this.userService.get(req.userId);
  }

  @Get(':id')
  async detail(@Param('id') id: ObjectId) {
    return await this.userService.get(id);
  }

  @UseGuards(AuthGuard)
  @Post('update-password')
  async updatePassword(
    @Body()
    updatePasswordDto: UpdatePasswordDto,
    @Request() req: ReqAuth,
  ) {
    return await this.userService.updatePassword(req.userId, updatePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Post('mail-otp')
  async sendMailOtp(@Request() req: ReqAuth) {
    return await this.userService.sendMailOtp(req.userId);
  }

  @UseGuards(AuthGuard)
  @Post('verify-email')
  async verifyEmail(
    @Request() req: ReqAuth,
    @Body() verifyEmailDto: VerifyEmailDto,
  ) {
    return await this.userService.verifyEmail(req.userId, verifyEmailDto.code);
  }

  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: ObjectId,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Role(RoleAuth.Admin)
  @Delete(':id')
  async delete(@Param('id') id: ObjectId) {
    return await this.userService.delete(id);
  }
}
