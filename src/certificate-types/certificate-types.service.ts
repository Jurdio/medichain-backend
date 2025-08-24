import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CertificateType } from './entities/certificate-type.entity';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { Direction } from '../directions/entities/direction.entity';

@Injectable()
export class CertificateTypesService {
  constructor(
    @InjectRepository(CertificateType) private readonly certTypeRepo: Repository<CertificateType>,
    @InjectRepository(Direction) private readonly directionRepo: Repository<Direction>,
  ) {}

  async create(dto: CreateCertificateTypeDto) {
    const entity = this.certTypeRepo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
    });
    if (dto.directionIds?.length) {
      entity.directions = await this.directionRepo.find({ where: { id: In(dto.directionIds) } });
    }
    return this.certTypeRepo.save(entity);
  }

  findAll() {
    return this.certTypeRepo.find({ relations: { directions: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const item = await this.certTypeRepo.findOne({ where: { id }, relations: { directions: true } });
    if (!item) throw new NotFoundException('CertificateType not found');
    return item;
  }

  async update(id: string, dto: UpdateCertificateTypeDto) {
    const item = await this.findOne(id);
    item.name = dto.name ?? item.name;
    item.slug = dto.slug ?? item.slug;
    item.description = dto.description ?? item.description;
    if (dto.directionIds) {
      item.directions = dto.directionIds.length
        ? await this.directionRepo.find({ where: { id: In(dto.directionIds) } })
        : [];
    }
    return this.certTypeRepo.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.certTypeRepo.remove(item);
    return { success: true };
  }
}


