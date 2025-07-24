import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CryptoAuthService } from './crypto-auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthVerifyDto } from './dto/auth-verify.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('crypto-auth')
@Controller('crypto-auth')
export class CryptoAuthController {
  constructor(private readonly cryptoAuthService: CryptoAuthService) {}

  @Post('request')
  @ApiOperation({ summary: 'Request authentication message to sign' })
  @ApiResponse({ status: 200, description: 'Authentication message generated', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid wallet address' })
  async requestAuth(@Body() authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    return this.cryptoAuthService.requestAuth(authRequestDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify signature and authenticate user' })
  @ApiResponse({ status: 200, description: 'Authentication successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid signature or message' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async verifyAuth(@Body() authVerifyDto: AuthVerifyDto): Promise<AuthResponseDto> {
    return this.cryptoAuthService.verifyAuth(authVerifyDto);
  }

  @Post('admin/test')
  @ApiOperation({ summary: 'Smoke test for crypto auth module' })
  @ApiResponse({ status: 200, description: 'Crypto auth module is working' })
  async smokeTest(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Crypto auth module is working correctly',
      timestamp: new Date().toISOString(),
    };
  }
}
