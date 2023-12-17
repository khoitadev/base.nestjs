import { Controller, Get, Param, Post, Put, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Public } from '~/auth/decorators/public.decorator';
import { EmailService } from '~/email/email.service';
import { CreateEmailDto, SendEmailDto, UpdateEmailDto } from '~/dto';
import { DataSendMail, EmailTemplate } from '~/interface';
import { Role } from '~/auth/decorators/role.decorator';
import { RoleAuth } from '~/enum';

@ApiTags('email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Role(RoleAuth.Admin)
  @Get('list')
  async list(): Promise<EmailTemplate[]> {
    return await this.emailService.list();
  }

  @Public()
  @Get(':id')
  async detail(@Param('id') id: ObjectId) {
    return await this.emailService.getById(id);
  }

  @Role(RoleAuth.Admin)
  @Post('create')
  async create(@Body() createEmailDto: CreateEmailDto) {
    return await this.emailService.create(createEmailDto);
  }

  @Public()
  @Post('send')
  async send(@Body() sendEmailDto: SendEmailDto) {
    return await this.emailService.sendMail(sendEmailDto);
  }

  @Role(RoleAuth.Admin)
  @Put(':id')
  async update(
    @Body() updateEmailDto: UpdateEmailDto,
    @Param('id') id: ObjectId,
  ) {
    return await this.emailService.update(id, updateEmailDto);
  }
}
