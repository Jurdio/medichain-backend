import { Controller, Get, Headers, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DoctorsService } from '../doctors/doctors.service';
import { PrivyService } from '../common/privy/privy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly privyService: PrivyService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user (from JWT)' })
  @ApiOkResponse({ description: 'Current user payload', schema: {
    type: 'object',
    properties: {
      sub: { type: 'string' },
      email: { type: 'string' },
      walletAddress: { type: 'string' },
      roleSlug: { type: 'string', nullable: true },
      permissions: { type: 'object' },
      iat: { type: 'number' },
      exp: { type: 'number' },
    },
  } })
  async me(@Req() req: any) {
    return req.user;
  }
}




