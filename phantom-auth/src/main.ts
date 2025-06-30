import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalJwtAuthGuard } from './common/guards/global-jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Налаштування глобального JWT guard
  const globalJwtGuard = app.get(GlobalJwtAuthGuard);
  app.useGlobalGuards(globalJwtGuard);

  app.enableCors({
    origin: [
      process.env.WEB_APP_ORIGIN ?? 'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
