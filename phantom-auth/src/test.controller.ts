import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SkipAuthJwt } from './common/decorators/skip-auth-jwt.decorator';

@Controller('test')
export class TestController {
    @Get('public')
    @SkipAuthJwt()
    @HttpCode(HttpStatus.OK)
    public() {
        return { message: 'This is a public route' };
    }

    @Get('private')
    @HttpCode(HttpStatus.OK)
    private() {
        return { message: 'This is a private route that requires authentication' };
    }
} 