import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreateAdminDto } from '~/dto';
import { AdminService } from '~/admin/admin.service';
import { Public } from '~/auth/decorators/public.decorator';
import { Role } from '~/auth/decorators/role.decorator';
import { UserService } from '~/user/user.service';
import { RoleAuth } from '~/enum';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Role(RoleAuth.Admin)
  @Get('list-user')
  async listUser() {
    return await this.userService.list();
  }

  @Public()
  @Get(':id')
  async detail(@Param('id') id: ObjectId) {
    return await this.adminService.get(id);
  }

  @Public()
  @Post('create')
  async create(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminService.create(createAdminDto);
  }
}
