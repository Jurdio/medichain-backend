import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SaJwtAuthGuard extends AuthGuard('sa-jwt') {}


