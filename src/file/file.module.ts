import { Module } from '@nestjs/common';
import { FileController } from '~/file/file.controller';
import { FileService } from '~/file/file.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '~/plugin/multer.plugin';
@Module({
  imports: [
    // MulterModule.registerAsync({ useFactory: async () => multerOptions }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
