import { Global, Module } from '@nestjs/common';
import { TenantContext } from './tenant.context';
import { TenantRepositoryFactory } from './tenant-repository.factory';
import { TenantGuard } from './tenant.guard';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './tenant.interceptor';

@Global()
@Module({
  providers: [TenantContext, TenantRepositoryFactory, TenantGuard, { provide: APP_INTERCEPTOR, useClass: TenantInterceptor }],
  exports: [TenantContext, TenantRepositoryFactory, TenantGuard],
})
export class TenantModule {}


