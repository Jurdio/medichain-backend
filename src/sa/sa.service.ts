import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { History } from '../history/entities/history.entity';
import { Direction } from '../directions/entities/direction.entity';
import { CertificateType } from '../certificate-types/entities/certificate-type.entity';
import { Role } from '../roles/entities/role.entity';

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
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async getOverviewStats() {
    const [tenants, doctors, histories, directions, certificateTypes, roles] = await Promise.all([
      this.tenantRepo.count(),
      this.doctorRepo.count(),
      this.historyRepo.count(),
      this.directionRepo.count(),
      this.certificateTypeRepo.count(),
      this.roleRepo.count(),
    ]);

    const [activeDoctors, inactiveDoctors] = await Promise.all([
      this.doctorRepo.count({ where: { active: true } as any }),
      this.doctorRepo.count({ where: { active: false } as any }),
    ]);

    const uniquePatientsRow = await this.historyRepo
      .createQueryBuilder('h')
      .select('COUNT(DISTINCT h.patientWalletAddress)', 'cnt')
      .getRawOne<{ cnt: string }>();
    const issuingDoctorsRow = await this.historyRepo
      .createQueryBuilder('h')
      .select('COUNT(DISTINCT h.doctorWalletAddress)', 'cnt')
      .getRawOne<{ cnt: string }>();

    const uniquePatients = Number(uniquePatientsRow?.cnt ?? 0);
    const issuingDoctors = Number(issuingDoctorsRow?.cnt ?? 0);

    // Recent issuance activity: last 14 days
    const activity14d = await this.historyRepo
      .createQueryBuilder('h')
      .select("DATE_TRUNC('day', h.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where("h.createdAt >= NOW() - INTERVAL '14 days'")
      .groupBy("DATE_TRUNC('day', h.createdAt)")
      .orderBy("DATE_TRUNC('day', h.createdAt)", 'ASC')
      .getRawMany();

    // New doctors in last 30 days
    const newDoctors30d = await this.doctorRepo
      .createQueryBuilder('d')
      .select("DATE_TRUNC('day', d.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where("d.createdAt >= NOW() - INTERVAL '30 days'")
      .groupBy("DATE_TRUNC('day', d.createdAt)")
      .orderBy("DATE_TRUNC('day', d.createdAt)", 'ASC')
      .getRawMany();

    // New tenants in last 30 days (daily buckets)
    const newTenants30d = await this.tenantRepo
      .createQueryBuilder('t')
      .select("DATE_TRUNC('day', t.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where("t.createdAt >= NOW() - INTERVAL '30 days'")
      .groupBy("DATE_TRUNC('day', t.createdAt)")
      .orderBy("DATE_TRUNC('day', t.createdAt)", 'ASC')
      .getRawMany();

    // Removed newTenants90d (weekly) per request

    // Leaderboards
    const topTenants = await this.historyRepo
      .createQueryBuilder('h')
      .leftJoin(Tenant, 't', 't.id = h.tenantId')
      .select('h.tenantId', 'tenantId')
      .addSelect('t.name', 'tenantName')
      .addSelect('t.slug', 'tenantSlug')
      .addSelect('COUNT(*)', 'count')
      .groupBy('h.tenantId')
      .addGroupBy('t.name')
      .addGroupBy('t.slug')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Removed topDoctors per request

    // Distributions
    // Removed distributions per request

    // Removed recentActivity per request

    return {
      totals: {
        tenants,
        doctors,
        doctorsActive: activeDoctors,
        doctorsInactive: inactiveDoctors,
        roles,
        certificateTypes,
        directions,
        certificatesIssued: histories,
        uniquePatients,
        issuingDoctors,
      },
      activity14d: activity14d.map((r) => ({ day: r.day, count: Number(r.count) })),
      newDoctors30d: newDoctors30d.map((r) => ({ day: r.day, count: Number(r.count) })),
      newTenants30d: newTenants30d.map((r) => ({ day: r.day, count: Number(r.count) })),
      topTenants: topTenants.map((r) => ({ tenantId: r.tenantId, tenantName: r.tenantName, tenantSlug: r.tenantSlug, count: Number(r.count) })),
      
    };
  }

  async getTenantStats(tenantId: string) {
    const [doctors, histories, directions, certificateTypes, roles] = await Promise.all([
      this.doctorRepo.count({ where: { tenantId } as any }),
      this.historyRepo.count({ where: { tenantId } as any }),
      this.directionRepo.count({ where: { tenantId } as any }),
      this.certificateTypeRepo.count({ where: { tenantId } as any }),
      this.roleRepo.count({ where: { tenantId } as any }),
    ]);

    const [activeDoctors, inactiveDoctors] = await Promise.all([
      this.doctorRepo.count({ where: { tenantId, active: true } as any }),
      this.doctorRepo.count({ where: { tenantId, active: false } as any }),
    ]);

    const uniquePatientsRow = await this.historyRepo
      .createQueryBuilder('h')
      .select('COUNT(DISTINCT h.patientWalletAddress)', 'cnt')
      .where('h.tenantId = :tenantId', { tenantId })
      .getRawOne<{ cnt: string }>();
    const issuingDoctorsRow = await this.historyRepo
      .createQueryBuilder('h')
      .select('COUNT(DISTINCT h.doctorWalletAddress)', 'cnt')
      .where('h.tenantId = :tenantId', { tenantId })
      .getRawOne<{ cnt: string }>();

    const uniquePatients = Number(uniquePatientsRow?.cnt ?? 0);
    const issuingDoctors = Number(issuingDoctorsRow?.cnt ?? 0);

    const activity14d = await this.historyRepo
      .createQueryBuilder('h')
      .select("DATE_TRUNC('day', h.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where('h.tenantId = :tenantId', { tenantId })
      .andWhere("h.createdAt >= NOW() - INTERVAL '14 days'")
      .groupBy("DATE_TRUNC('day', h.createdAt)")
      .orderBy("DATE_TRUNC('day', h.createdAt)", 'ASC')
      .getRawMany();

    const newDoctors30d = await this.doctorRepo
      .createQueryBuilder('d')
      .select("DATE_TRUNC('day', d.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where('d.tenantId = :tenantId', { tenantId })
      .andWhere("d.createdAt >= NOW() - INTERVAL '30 days'")
      .groupBy("DATE_TRUNC('day', d.createdAt)")
      .orderBy("DATE_TRUNC('day', d.createdAt)", 'ASC')
      .getRawMany();

    // Removed topDoctors per request

    // Removed distributions per request

    // Removed recentActivity per request

    return {
      tenantId,
      totals: {
        doctors,
        doctorsActive: activeDoctors,
        doctorsInactive: inactiveDoctors,
        roles,
        certificatesIssued: histories,
        directions,
        certificateTypes,
        uniquePatients,
        issuingDoctors,
      },
      activity14d: activity14d.map((r) => ({ day: r.day, count: Number(r.count) })),
      newDoctors30d: newDoctors30d.map((r) => ({ day: r.day, count: Number(r.count) })),
      
    };
  }
}


