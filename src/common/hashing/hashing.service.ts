import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingService {
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    const configured = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    const parsed = configured ? parseInt(configured, 10) : NaN;
    this.saltRounds = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  }

  async hashPassword(plainTextPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(plainTextPassword, salt);
  }

  async verifyPassword(plainTextPassword: string, passwordHash: string): Promise<boolean> {
    if (!passwordHash) return false;
    return bcrypt.compare(plainTextPassword, passwordHash);
  }
}
