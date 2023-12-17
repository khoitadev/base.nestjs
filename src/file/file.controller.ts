import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '~/plugin/multer.plugin';
import { FileService } from '~/file/file.service';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.upload(file);
  }

  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadVideo(file);
  }
}
