import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DoctorsService } from '../doctors/doctors.service';
import { PrivyService } from '../common/privy/privy.service';
import { ConfigService } from '@nestjs/config';

export type JwtUser = {
  sub: string;
  email: string;
  walletAddress: string;
  roleSlug: string | null;
  permissions?: Record<string, Record<string, { read: boolean; save: boolean }>>;
  tenantId: string;
  isSuperAdmin?: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly jwtService: JwtService,
    private readonly privyService: PrivyService,
    private readonly configService: ConfigService,
  ) {}

  private async signAccessToken(payload: JwtUser): Promise<string> {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '15m';
    const secret = this.configService.get<string>('JWT_SECRET') || 'dev_secret_change_me';
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  private async signRefreshToken(payload: Pick<JwtUser, 'sub' | 'email'>): Promise<string> {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret_change_me';
    return this.jwtService.signAsync({ sub: payload.sub, email: payload.email }, { secret, expiresIn });
  }

  async loginByEmail(email: string) {
    const doctor = await this.doctorsService.findByEmailOrWallet({ email });
    if (!doctor || !doctor.active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // try to enrich wallet from Privy if missing
    if (!doctor.walletAddress && doctor.email) {
      const w = await this.privyService.getPrimaryWalletByEmail(doctor.email);
      if (w) {
        // NOTE: not persisting to DB here to keep login simple; can be added later
        (doctor as any).walletAddress = w;
      }
    }

    const payload: JwtUser = {
      sub: doctor.id,
      email: doctor.email,
      walletAddress: doctor.walletAddress,
      roleSlug: doctor.role?.slug ?? null,
      permissions: doctor.role?.permissions as any,
      tenantId: (doctor as any).tenantId,
      isSuperAdmin: doctor.role?.slug === 'super_admin',
    };

    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken({ sub: payload.sub, email: payload.email });
    return {
      accessToken,
      refreshToken,
      user: {
        id: doctor.id,
        email: doctor.email,
        walletAddress: doctor.walletAddress,
        role: doctor.role?.slug ?? null,
        permissions: doctor.role?.permissions ?? {},
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret_change_me';
      const decoded: any = await this.jwtService.verifyAsync(refreshToken, { secret });
      const { sub, email } = decoded || {};
      if (!sub || !email) throw new UnauthorizedException('Invalid refresh token');

      const doctor = await this.doctorsService.findOne(sub);
      if (!doctor || !doctor.active) throw new UnauthorizedException('User not active');

      const payload: JwtUser = {
        sub: doctor.id,
        email: doctor.email,
        walletAddress: doctor.walletAddress,
        roleSlug: doctor.role?.slug ?? null,
        permissions: doctor.role?.permissions as any,
        tenantId: (doctor as any).tenantId,
        isSuperAdmin: doctor.role?.slug === 'super_admin',
      };

      const newAccessToken = await this.signAccessToken(payload);
      const newRefreshToken = await this.signRefreshToken({ sub: payload.sub, email: payload.email });
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}


