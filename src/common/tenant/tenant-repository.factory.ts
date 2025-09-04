import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { TenantContext } from './tenant.context';

@Injectable()
export class TenantRepositoryFactory {
  constructor(private readonly dataSource: DataSource, private readonly tenantContext: TenantContext) {}

  getRepository<T extends { tenantId?: string }>(entity: { new (): T }): Repository<T> & { qb(alias?: string): SelectQueryBuilder<T> } {
    const base = this.dataSource.getRepository(entity);
    const tenantContext = this.tenantContext;

    const original = {
      save: base.save.bind(base),
      find: base.find.bind(base),
      findOne: base.findOne.bind(base),
      findAndCount: base.findAndCount.bind(base),
      createQueryBuilder: base.createQueryBuilder.bind(base),
      metadata: base.metadata,
    } as const;

    const api: Partial<Repository<T>> & { qb(alias?: string): SelectQueryBuilder<T> } = {
      qb: (alias = original.metadata.name) => {
        const tenantId = tenantContext.getTenantId();
        const builder = original.createQueryBuilder(alias);
        if (tenantId) {
          builder.andWhere(`${alias}.tenantId = :tenantId`, { tenantId });
        }
        return builder;
      },
      async save(entityOrEntities: any) {
        const tenantId = tenantContext.getTenantId();
        const applyTenant = (e: any) => {
          if (tenantId && !e.tenantId) e.tenantId = tenantId;
        };
        if (Array.isArray(entityOrEntities)) entityOrEntities.forEach(applyTenant);
        else applyTenant(entityOrEntities);
        return original.save(entityOrEntities);
      },
      async find(options?: any) {
        const tenantId = tenantContext.getTenantId();
        if (!tenantId) return original.find(options as any);
        const alias = original.metadata.name;
        return api.qb(alias).setFindOptions(options ?? {}).getMany();
      },
      async findOne(options?: any) {
        const tenantId = tenantContext.getTenantId();
        if (!tenantId) return original.findOne(options as any);
        const alias = original.metadata.name;
        return api.qb(alias).setFindOptions(options ?? {}).getOne();
      },
      async findAndCount(options?: any) {
        const tenantId = tenantContext.getTenantId();
        if (!tenantId) return original.findAndCount(options as any);
        const alias = original.metadata.name;
        return api.qb(alias).setFindOptions(options ?? {}).getManyAndCount();
      },
    } as any;

    // Return a shallow wrapper whose prototype is the base repo
    return Object.assign(Object.create(base), api);
  }
}


