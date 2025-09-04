import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { sub: string; isSuperAdmin?: boolean; tenantId?: string } | undefined;
    if (!user) throw new UnauthorizedException();

    // Super admin may specify x-tenant-id header to impersonate a tenant
    // Validation only: ensure tenant is present (unless super admin without header)
    const headerTenantId = req.headers['x-tenant-id'] as string | undefined;
    const effectiveTenantId = user.isSuperAdmin && headerTenantId ? headerTenantId : user.tenantId;
    if (!effectiveTenantId) throw new UnauthorizedException('Tenant context is missing');
    return true;
  }
}


