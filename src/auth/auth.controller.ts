import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { DoctorsService } from '../doctors/doctors.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly doctorsService: DoctorsService,
  ) {}

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'Returns current doctor with full role object',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string' },
        walletAddress: { type: 'string' },
        fullName: { type: 'string' },
        phone: { type: 'string', nullable: true },
        specialization: { type: 'string', nullable: true },
        active: { type: 'boolean' },
        role: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            permissions: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  properties: {
                    read: { type: 'boolean' },
                    save: { type: 'boolean' },
                  },
                },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async me(@Req() req: any) {
    const user = req.user;
    const doctor = await this.doctorsService.findOneWithRole(user.sub);
    return {
      id: doctor.id,
      email: doctor.email,
      walletAddress: doctor.walletAddress,
      fullName: doctor.fullName,
      phone: doctor.phone ?? null,
      specialization: doctor.specialization ?? null,
      active: doctor.active,
      role: doctor.role ?? null,
    };
  }
}


