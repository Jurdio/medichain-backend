import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_METADATA_KEY, RequiredPermission } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<RequiredPermission | undefined>(PERMISSION_METADATA_KEY, context.getHandler());
    if (!required) return true; // no specific permission required

    const request = context.switchToHttp().getRequest();
    const user = request.user as { permissions?: Record<string, Record<string, { read: boolean; save: boolean }>> } | undefined;
    if (!user) {
      throw new UnauthorizedException();
    }

    const domainPermissions = user.permissions?.[required.domain];
    const modulePermissions = domainPermissions?.[required.moduleName];
    const allowed = modulePermissions?.[required.action] === true;
    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}


