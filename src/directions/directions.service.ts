import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Direction } from './entities/direction.entity';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { CertificateType } from '../certificate-types/entities/certificate-type.entity';
import { PaginationQueryDto } from '../history/dto/pagination-query.dto';
import { TenantRepositoryFactory } from '../common/tenant/tenant-repository.factory';

@Injectable()
export class DirectionsService {
  private directionRepo: Repository<Direction> & { qb(alias?: string): any };
  private certTypeRepo: Repository<CertificateType> & { qb(alias?: string): any };

  constructor(
    private readonly tenantRepoFactory: TenantRepositoryFactory,
  ) {
    this.directionRepo = this.tenantRepoFactory.getRepository(Direction);
    this.certTypeRepo = this.tenantRepoFactory.getRepository(CertificateType);
  }

  async create(dto: CreateDirectionDto) {
    const direction = this.directionRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
    });

    if (dto.certificateTypeIds?.length) {
      direction.certificateTypes = await this.certTypeRepo.find({ where: { id: In(dto.certificateTypeIds) } });
    }
    return this.directionRepo.save(direction);
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.directionRepo.findAndCount({
      relations: { certificateTypes: true },
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
    const item = await this.directionRepo.findOne({ where: { id }, relations: { certificateTypes: true } });
    if (!item) throw new NotFoundException('Direction not found');
    return item;
  }

  async update(id: string, dto: UpdateDirectionDto) {
    const direction = await this.findOne(id);
    direction.name = dto.name ?? direction.name;
    direction.slug = dto.slug ?? direction.slug;
    direction.description = dto.description ?? direction.description;

    if (dto.certificateTypeIds) {
      direction.certificateTypes = dto.certificateTypeIds.length
        ? await this.certTypeRepo.find({ where: { id: In(dto.certificateTypeIds) } })
        : [];
    }

    return this.directionRepo.save(direction);
  }

  async remove(id: string) {
    const direction = await this.findOne(id);
    await this.directionRepo.remove(direction);
    return { success: true };
  }
}


