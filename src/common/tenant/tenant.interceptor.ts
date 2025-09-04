import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext } from './tenant.context';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly tenantContext: TenantContext) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { tenantId?: string; isSuperAdmin?: boolean } | undefined;
    const headerTenantId = (req.headers?.['x-tenant-id'] as string | undefined) || undefined;
    const effectiveTenantId = user?.isSuperAdmin && headerTenantId ? headerTenantId : user?.tenantId;

    return this.tenantContext.runWithTenant(effectiveTenantId, () => next.handle());
  }
}


