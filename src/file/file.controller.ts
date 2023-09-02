import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public',
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
  uploadfie(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File Uploaded Successfully!',
      data: file.filename,
    };
  }
}
