import { ApiProperty } from '@nestjs/swagger';
import { CountPointDto } from './overview-stats.dto';

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

  // Removed topDoctors and distributions per request

  // recentActivity removed per request
}


