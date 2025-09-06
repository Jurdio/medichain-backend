import { ApiProperty } from '@nestjs/swagger';
import { CountPointDto, DistributionsDto, RecentActivityDto, TopDoctorDto } from './overview-stats.dto';

export class TenantTotalsDto {
  @ApiProperty()
  doctors!: number;

  @ApiProperty()
  doctorsActive!: number;

  @ApiProperty()
  doctorsInactive!: number;

  @ApiProperty()
  roles!: number;

  @ApiProperty()
  certificatesIssued!: number;

  @ApiProperty()
  directions!: number;

  @ApiProperty()
  certificateTypes!: number;

  @ApiProperty()
  uniquePatients!: number;

  @ApiProperty()
  issuingDoctors!: number;
}

export class TenantStatsDto {
  @ApiProperty()
  tenantId!: string;

  @ApiProperty({ type: TenantTotalsDto })
  totals!: TenantTotalsDto;

  @ApiProperty({ type: [CountPointDto] })
  activity14d!: CountPointDto[];

  @ApiProperty({ type: [CountPointDto] })
  newDoctors30d!: CountPointDto[];

  @ApiProperty({ type: [TopDoctorDto] })
  topDoctors!: TopDoctorDto[];

  @ApiProperty({ type: DistributionsDto })
  distributions!: DistributionsDto;

  @ApiProperty({ type: [RecentActivityDto] })
  recentActivity!: RecentActivityDto[];
}


