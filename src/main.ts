import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const doctorsFrontend = process.env.DOCTORS_FRONTEND_ADDRESS;
  const adminFrontend = process.env.ADMIN_FRONTEND_ADDREES; // intentionally using provided env name
  const allowedOrigins = [
    'http://localhost:5173',
    doctorsFrontend,
    adminFrontend,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Medical Admin Panel API')
    .setDescription('API documentation for the Medical Admin Panel backend')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearer')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'sa-bearer')
    .addTag('sa-auth', 'Super admin authentication')
    .addTag('sa', 'Super admin endpoints')
    .addTag('protect', 'Operations related to certificate protection')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips away properties that are not defined in the DTO
    forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to be objects initialized of DTO classes
  }));
  await app.listen(3000);
}
bootstrap();
