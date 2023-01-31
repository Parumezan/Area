import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('AREAmogus API')
    .setDescription('The AREAmogus API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.BACK_PORT || 8080);
}
bootstrap();
