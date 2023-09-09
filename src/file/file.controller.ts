import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileService } from './file.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('file')
@UseGuards(AuthGuard)
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
      limits: {
        fileSize: Infinity,
      },
    }),
  )
  uploadfie(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return {
      message: 'File Uploaded Successfully!',
      data: file.filename,
    };
  }
}
