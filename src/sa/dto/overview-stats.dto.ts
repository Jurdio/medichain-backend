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
  @ApiProperty({ example: '2025-01-06', description: 'Start of ISO week (UTC, YYYY-MM-DD)' })
  weekStart!: string;

  @ApiProperty({ example: '2025-W02', description: 'ISO week label (IYYY-WIW)' })
  weekIso!: string;

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

// Removed TopDoctor and distributions from overview response per request

// Removed RecentActivity from overview response per request

export class OverviewStatsDto {
  @ApiProperty({ type: TotalsOverviewDto })
  totals!: TotalsOverviewDto;

  @ApiProperty({ type: [CountPointDto] })
  activity14d!: CountPointDto[];

  @ApiProperty({ type: [CountPointDto] })
  newDoctors30d!: CountPointDto[];

  @ApiProperty({ type: [CountPointDto] })
  newTenants30d!: CountPointDto[];

  @ApiProperty({ type: [TopTenantDto] })
  topTenants!: TopTenantDto[];

  // recentActivity removed per request
}


