import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CertificateType } from './entities/certificate-type.entity';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { Direction } from '../directions/entities/direction.entity';
import { PaginationQueryDto } from '../history/dto/pagination-query.dto';
import { TenantRepositoryFactory } from '../common/tenant/tenant-repository.factory';

@Injectable()
export class CertificateTypesService {
  private certTypeRepo: Repository<CertificateType> & { qb(alias?: string): any };

  constructor(
    private readonly tenantRepoFactory: TenantRepositoryFactory,
  ) {
    this.certTypeRepo = this.tenantRepoFactory.getRepository(CertificateType);
  }

  async create(dto: CreateCertificateTypeDto) {
    const entity = this.certTypeRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
    });
    return this.certTypeRepo.save(entity);
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.certTypeRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        perPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: string) {
    const item = await this.certTypeRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('CertificateType not found');
    return item;
  }

  async update(id: string, dto: UpdateCertificateTypeDto) {
    const item = await this.findOne(id);
    item.name = dto.name ?? item.name;
    item.slug = dto.slug ?? item.slug;
    item.description = dto.description ?? item.description;
    return this.certTypeRepo.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.certTypeRepo.remove(item);
    return { success: true };
  }
}


