import { Module, Global } from '@nestjs/common';
import { EmailController } from '~/email/email.controller';
import { EmailService } from '~/email/email.service';

@Global()
@Module({
  imports: [],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
