import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';

@Controller('files') // Acá se le da el nombre al endpoint (http://localhost/api/files)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product') // Acá se le agrega un nombre adicional al endpoint (http://localhost/api/files/product)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter, // Con este validator no pasaría el file si no cumple
      // limits: { fileSize: 1000 }, // Agrega limites del peso del file
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }), // Donde se desea almacenar el file
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('Make sure that the file is an image');

    console.log({ file });

    return file.originalname;
  }
}
