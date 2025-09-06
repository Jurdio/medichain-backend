import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { History } from '../history/entities/history.entity';
import { Direction } from '../directions/entities/direction.entity';
import { CertificateType } from '../certificate-types/entities/certificate-type.entity';

@Injectable()
export class SaService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(History)
    private readonly historyRepo: Repository<History>,
    @InjectRepository(Direction)
    private readonly directionRepo: Repository<Direction>,
    @InjectRepository(CertificateType)
    private readonly certificateTypeRepo: Repository<CertificateType>,
  ) {}

  async getOverviewStats() {
    const [tenants, doctors, histories, directions, certificateTypes] = await Promise.all([
      this.tenantRepo.count(),
      this.doctorRepo.count(),
      this.historyRepo.count(),
      this.directionRepo.count(),
      this.certificateTypeRepo.count(),
    ]);

    // Recent activity: last 14 days history counts per day
    const activity = await this.historyRepo
      .createQueryBuilder('h')
      .select("DATE_TRUNC('day', h.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where("h.createdAt >= NOW() - INTERVAL '14 days'")
      .groupBy("DATE_TRUNC('day', h.createdAt)")
      .orderBy("DATE_TRUNC('day', h.createdAt)", 'ASC')
      .getRawMany();

    return {
      totals: { tenants, doctors, certificatesIssued: histories, directions, certificateTypes },
      activity: activity.map((r) => ({ day: r.day, count: Number(r.count) })),
    };
  }

  async getTenantStats(tenantId: string) {
    const [doctors, histories, directions, certificateTypes] = await Promise.all([
      this.doctorRepo.count({ where: { tenantId } as any }),
      this.historyRepo.count({ where: { tenantId } as any }),
      this.directionRepo.count({ where: { tenantId } as any }),
      this.certificateTypeRepo.count({ where: { tenantId } as any }),
    ]);

    const activity = await this.historyRepo
      .createQueryBuilder('h')
      .select("DATE_TRUNC('day', h.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where('h.tenantId = :tenantId', { tenantId })
      .andWhere("h.createdAt >= NOW() - INTERVAL '14 days'")
      .groupBy("DATE_TRUNC('day', h.createdAt)")
      .orderBy("DATE_TRUNC('day', h.createdAt)", 'ASC')
      .getRawMany();

    return {
      tenantId,
      totals: { doctors, certificatesIssued: histories, directions, certificateTypes },
      activity: activity.map((r) => ({ day: r.day, count: Number(r.count) })),
    };
  }
}


