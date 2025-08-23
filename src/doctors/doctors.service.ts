import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorsDto } from './dto/query-doctors.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async findAll(query: QueryDoctorsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any[] = [];

    if (query.email) {
      where.push({ email: query.email });
    }
    if (query.walletAddress) {
      where.push({ walletAddress: query.walletAddress });
    }
    if (query.search) {
      const ilike = ILike(`%${query.search}%`);
      where.push({ fullName: ilike });
      where.push({ email: ilike });
      where.push({ walletAddress: ilike });
    }

    const [items, total] = await this.doctorRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
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
    const doctor = await this.doctorRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
    
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    const { isActive, ...rest } = updateDoctorDto;
    const mapped: Partial<Doctor> = { ...rest } as Partial<Doctor>;
    if (typeof isActive === 'boolean') {
      mapped.active = isActive;
    }
    const preload = await this.doctorRepository.preload({ id, ...mapped });
    if (!preload) {
      throw new NotFoundException('Doctor not found');
    }
    return this.doctorRepository.save(preload);
  }

  async remove(id: string) {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
    return { success: true };
  }
}


