import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, '../../', '/public'),
        filename: (req, file, cb) => {
          const filename =
            new Date().getTime().toString() +
            '.' +
            file.originalname.split('.')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  uploadfie() {}
}
