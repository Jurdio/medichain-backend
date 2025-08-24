import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Direction } from './entities/direction.entity';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { CertificateType } from '../certificate-types/entities/certificate-type.entity';

@Injectable()
export class DirectionsService {
  constructor(
    @InjectRepository(Direction) private readonly directionRepo: Repository<Direction>,
    @InjectRepository(CertificateType) private readonly certTypeRepo: Repository<CertificateType>,
  ) {}

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

  findAll() {
    return this.directionRepo.find({ relations: { certificateTypes: true }, order: { createdAt: 'DESC' } });
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


