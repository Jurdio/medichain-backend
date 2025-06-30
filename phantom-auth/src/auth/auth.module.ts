import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NonceService } from './nonce.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    controllers: [AuthController],
    providers: [AuthService, NonceService, JwtStrategy],
})
export class AuthModule {}
