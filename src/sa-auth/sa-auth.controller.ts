import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SaAuthService } from './sa-auth.service';
import { SaLoginRequestDto, SaLoginResponseDto } from './dto/sa-login.dto';

@ApiTags('sa-auth')
@Controller('sa/auth')
export class SaAuthController {
  constructor(private readonly saAuthService: SaAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Super Admin login' })
  @ApiBody({ type: SaLoginRequestDto })
  @ApiOkResponse({ description: 'Returns JWT access token and basic user info', type: SaLoginResponseDto })
  async login(@Body() body: SaLoginRequestDto) {
    return this.saAuthService.login(body);
  }
}


