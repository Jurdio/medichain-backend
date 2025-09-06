import { ApiProperty } from '@nestjs/swagger';

export class TotalsOverviewDto {
  @ApiProperty()
  tenants!: number;

  @ApiProperty()
  doctors!: number;

  @ApiProperty()
  doctorsActive!: number;

  @ApiProperty()
  doctorsInactive!: number;

  @ApiProperty()
  roles!: number;

  @ApiProperty()
  certificateTypes!: number;

  @ApiProperty()
  directions!: number;

  @ApiProperty({ description: 'Total certificates issued (history rows)' })
  certificatesIssued!: number;

  @ApiProperty({ description: 'Distinct patients by wallet address' })
  uniquePatients!: number;

  @ApiProperty({ description: 'Distinct doctors who issued certificates' })
  issuingDoctors!: number;
}

export class CountPointDto {
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  day!: string;

  @ApiProperty()
  count!: number;
}

export class WeekCountPointDto {
  @ApiProperty({ example: '2025-01-06T00:00:00.000Z' })
  week!: string;

  @ApiProperty()
  count!: number;
}

export class TopTenantDto {
  @ApiProperty()
  tenantId!: string;

  @ApiProperty({ nullable: true })
  tenantName?: string | null;

  @ApiProperty({ nullable: true })
  tenantSlug?: string | null;

  @ApiProperty()
  count!: number;
}

export class TopDoctorDto {
  @ApiProperty()
  doctorWalletAddress!: string;

  @ApiProperty()
  count!: number;
}

export class DoctorsByRoleDto {
  @ApiProperty({ nullable: true })
  roleId?: string | null;

  @ApiProperty({ nullable: true })
  roleName?: string | null;

  @ApiProperty()
  count!: number;
}

export class DoctorsBySpecializationDto {
  @ApiProperty({ nullable: true })
  specialization?: string | null;

  @ApiProperty()
  count!: number;
}

export class DistributionsDto {
  @ApiProperty({ type: [DoctorsByRoleDto] })
  doctorsByRole!: DoctorsByRoleDto[];

  @ApiProperty({ type: [DoctorsBySpecializationDto] })
  doctorsBySpecialization!: DoctorsBySpecializationDto[];
}

export class RecentActivityDto {
  @ApiProperty({ nullable: true })
  tenantId?: string | null;

  @ApiProperty()
  doctorWalletAddress!: string;

  @ApiProperty()
  patientWalletAddress!: string;

  @ApiProperty()
  transactionSignature!: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt!: string;
}

export class OverviewStatsDto {
  @ApiProperty({ type: TotalsOverviewDto })
  totals!: TotalsOverviewDto;

  @ApiProperty({ type: [CountPointDto] })
  activity14d!: CountPointDto[];

  @ApiProperty({ type: [CountPointDto] })
  newDoctors30d!: CountPointDto[];

  @ApiProperty({ type: [WeekCountPointDto] })
  newTenants90d!: WeekCountPointDto[];

  @ApiProperty({ type: [TopTenantDto] })
  topTenants!: TopTenantDto[];

  @ApiProperty({ type: [TopDoctorDto] })
  topDoctors!: TopDoctorDto[];

  @ApiProperty({ type: DistributionsDto })
  distributions!: DistributionsDto;

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivity!: RecentActivityDto[];
}


