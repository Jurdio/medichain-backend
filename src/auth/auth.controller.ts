import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/login.dto';

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
}


