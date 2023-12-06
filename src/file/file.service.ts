import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { cloud } from '~/plugin/multer.plugin';

@Injectable()
export class FileService {
  async upload(file: any): Promise<any> {
    const { mimetype, filename, size } = file;
    const data = await cloud.uploader.upload(file.path, {
      resource_type: 'auto',
    });
    const { width, height, format } = data;
    const reg = new RegExp(`/upload/(v[0-9]+)/(${data.public_id}.*)`);
    const regExec = reg.exec(data.url);
    const path = `${process.env.MEDIA_PUBLISH}/media/${process.env.CLOUD_NAME}/uid/${regExec[1]}/${regExec[2]}`;
    fs.unlinkSync(file.path);
    return {
      path: path,
      mimetype,
      name: filename,
      width,
      height,
      format,
      size,
    };
  }

  async uploadVideo(file: any): Promise<any> {
    const { mimetype, filename, size } = file;
    return new Promise((resolve, reject) => {
      cloud.uploader.upload_large(
        file.path,
        {
          resource_type: 'video',
          chunk_size: 6000000,
        },
        function (error, result) {
          if (error) reject(error);
          const { width, height, format } = result;
          const reg = new RegExp(`/upload/(v[0-9]+)/(${result.public_id}.*)`);
          const regExec = reg.exec(result.url);
          const path = `${process.env.MEDIA_PUBLISH}/video/${process.env.CLOUD_NAME}/uid/${regExec[1]}/${regExec[2]}`;
          fs.unlinkSync(file.path);
          resolve({
            path: path,
            mimetype,
            name: filename,
            width,
            height,
            format,
            size,
          });
        },
      );
    });
  }
}
