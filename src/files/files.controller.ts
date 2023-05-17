// Express
import { Response } from 'express';
// NestJS
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
// Services
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
// helpers
import { fileFilter, fileNamer } from './helpers';

@Controller('files') // Acá se le da el nombre al endpoint (http://localhost/api/files)
export class FilesController {
  constructor(
    //
    private readonly filesService: FilesService,
    // Para las Environment variables
    private readonly configService: ConfigService,
  ) {}

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

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;

    return { secureUrl };
  }

  @Get('product/:imageName')
  findProductImage(
    //
    @Res() res: Response, // Permite persolanizar la response
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }
}
