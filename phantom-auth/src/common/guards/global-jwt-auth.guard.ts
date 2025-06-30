import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_JWT_KEY } from '../decorators/skip-auth-jwt.decorator';

@Injectable()
export class GlobalJwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(ctx: ExecutionContext) {
        const skip = this.reflector.getAllAndOverride<boolean>(
            SKIP_AUTH_JWT_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );
        
        if (skip) {
            return true;
        }
        
        return super.canActivate(ctx);
    }
} 