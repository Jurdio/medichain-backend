import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips away properties that are not defined in the DTO
    forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to be objects initialized of DTO classes
  }));
  await app.listen(3000);
}
bootstrap();
