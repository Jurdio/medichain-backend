import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SaAuthService } from './sa-auth.service';

@ApiTags('sa-auth')
@Controller('sa/auth')
export class SaAuthController {
  constructor(private readonly saAuthService: SaAuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.saAuthService.login(body);
  }
}


