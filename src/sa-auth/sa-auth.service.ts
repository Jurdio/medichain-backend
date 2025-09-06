import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '../common/hashing/hashing.service';

export type SaJwtUser = {
  sub: string;
  email: string;
  isSa: true;
};

@Injectable()
export class SaAuthService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepo: Repository<AdminUser>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {}

  private async signAccessToken(payload: SaJwtUser): Promise<string> {
    const expiresIn = this.configService.get<string>('SA_JWT_EXPIRES_IN') || '30m';
    const secret = this.configService.get<string>('SA_JWT_SECRET') || 'dev_sa_secret_change_me';
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  async login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    const admin = await this.adminRepo.findOne({ where: { email }, select: { id: true, email: true, passwordHash: true, active: true } as any });
    if (!admin || !admin.active) throw new UnauthorizedException('Invalid credentials');

    const ok = await this.hashingService.verifyPassword(password, (admin as any).passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload: SaJwtUser = { sub: admin.id, email: admin.email, isSa: true };
    const accessToken = await this.signAccessToken(payload);
    return { accessToken, user: { id: admin.id, email: admin.email } };
  }
}


