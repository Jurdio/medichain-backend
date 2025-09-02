import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DoctorsService } from '../doctors/doctors.service';
import { PrivyService } from '../common/privy/privy.service';

export type JwtUser = {
  sub: string;
  email: string;
  walletAddress: string;
  roleSlug: string | null;
  permissions?: Record<string, Record<string, { read: boolean; save: boolean }>>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly jwtService: JwtService,
    private readonly privyService: PrivyService,
  ) {}

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
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: {
        id: doctor.id,
        email: doctor.email,
        walletAddress: doctor.walletAddress,
        role: doctor.role?.slug ?? null,
        permissions: doctor.role?.permissions ?? {},
      },
    };
  }
}


