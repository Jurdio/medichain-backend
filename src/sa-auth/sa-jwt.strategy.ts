import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SaJwtStrategy extends PassportStrategy(Strategy, 'sa-jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SA_JWT_SECRET') || 'dev_sa_secret_change_me',
    });
  }

  async validate(payload: any) {
    if (!payload?.isSa) throw new UnauthorizedException();
    return payload;
  }
}


