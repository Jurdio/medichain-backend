import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { GlobalJwtAuthGuard } from './common/guards/global-jwt-auth.guard';
import { TestController } from './test.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,                             // ← робимо глобальним
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_EXP', '15m') },
      }),
    }),
    AuthModule,                                 // важливо: вже після JwtModule
  ],
  controllers: [TestController],
  providers: [GlobalJwtAuthGuard],
})
export class AppModule {}
