import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login by email (no OTP), returns JWT' })
  @ApiOkResponse({ description: 'Returns access token and user payload', schema: {
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          walletAddress: { type: 'string' },
          role: { type: 'string', nullable: true },
          permissions: { type: 'object' },
        },
      },
    },
  } })
  async login(@Body() dto: EmailLoginDto) {
    return this.authService.loginByEmail(dto.email.trim());
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse({ description: 'Returns new access and refresh tokens', schema: {
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
  } })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }
}


