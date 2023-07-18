import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//
import { AppModule } from './app.module';

// bootstrap ==>> Arranque
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api'); // Para agregar el path 'api' like this "localhost:3000/api"

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Documentation by @nestjs/swagger
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API Elis')
    .setDescription('Teslo Shop endpoints')
    .setVersion('1.0')
    // .addTag('tagName') // Los tags se agregaron en cada controller con @ApiTags('tagName')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port: ${process.env.PORT}`);
}
bootstrap();
