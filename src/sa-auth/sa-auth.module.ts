import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaAuthService } from './sa-auth.service';
import { SaAuthController } from './sa-auth.controller';
import { AdminUser } from './entities/admin-user.entity';
import { SaJwtStrategy } from './sa-jwt.strategy';
import { HashingService } from '../common/hashing/hashing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    JwtModule.register({}),
  ],
  controllers: [SaAuthController],
  providers: [SaAuthService, SaJwtStrategy, HashingService],
  exports: [SaAuthService],
})
export class SaAuthModule {}


