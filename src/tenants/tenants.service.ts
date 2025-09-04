import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  create(dto: CreateTenantDto) {
    const entity = this.tenantRepository.create(dto);
    return this.tenantRepository.save(entity);
  }

  findAll() {
    return this.tenantRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const t = await this.tenantRepository.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Tenant not found');
    return t;
  }

  async update(id: string, dto: UpdateTenantDto) {
    const t = await this.findOne(id);
    Object.assign(t, dto);
    return this.tenantRepository.save(t);
  }

  async remove(id: string) {
    const t = await this.findOne(id);
    await this.tenantRepository.remove(t);
  }
}


