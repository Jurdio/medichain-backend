import {
    Controller, Get, Query, Post, Body,
    HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NonceQueryDto } from './dto/nonce-query.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Get('nonce')
    getNonce(@Query() { pubkey }: NonceQueryDto) {
        return this.auth.createNonce(pubkey);
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async verify(@Body() dto: VerifyDto) {
        const token = await this.auth.verify(dto.pubkey, dto.signature, dto.nonce);
        return { token };
    }
}
