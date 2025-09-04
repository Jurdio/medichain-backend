import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

type TenantStore = {
  tenantId?: string;
};

@Injectable()
export class TenantContext {
  private readonly als = new AsyncLocalStorage<TenantStore>();

  runWithTenant<T>(tenantId: string | undefined, callback: () => T): T {
    return this.als.run({ tenantId }, callback);
  }

  getTenantId(): string | undefined {
    return this.als.getStore()?.tenantId;
  }
}


