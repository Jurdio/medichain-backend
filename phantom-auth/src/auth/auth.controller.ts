import {
    Controller, Get, Query, Post, Body, Headers,
    HttpCode, HttpStatus, UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NonceQueryDto } from './dto/nonce-query.dto';
import { VerifyDto } from './dto/verify.dto';
import { SkipAuthJwt } from '../common/decorators/skip-auth-jwt.decorator';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @SkipAuthJwt()
    @Get('nonce')
    getNonce(@Query() { pubkey }: NonceQueryDto) {
        return this.auth.createNonce(pubkey);
    }

    @SkipAuthJwt()
    @Post('token')
    @HttpCode(HttpStatus.OK)
    async generateToken(@Body() dto: VerifyDto) {
        const token = await this.auth.generateToken(dto.pubkey, dto.signature, dto.nonce);
        return { token };
    }

    @Get('check')
    async check(@Headers('authorization') authHeader: string) {
        const token = authHeader?.split(' ')[1];
        if (!token) throw new UnauthorizedException('No token provided');
        const data = await this.auth.verifyToken(token);
        return { pubkey: data.pubkey };
    }

    @Get('test')
    @HttpCode(HttpStatus.OK)
    async test() {
        return { message: 'This route requires authentication' };
    }

    @Get('protected')
    @HttpCode(HttpStatus.OK)
    async protected() {
        return { message: 'This is a protected route' };
    }
}
