import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SaService } from './sa.service';
import { SaJwtAuthGuard } from '../sa-auth/sa-jwt.guard';
import { OverviewStatsDto } from './dto/overview-stats.dto';
import { TenantStatsDto } from './dto/tenant-stats.dto';

@ApiTags('sa')
@ApiBearerAuth('sa-bearer')
@UseGuards(SaJwtAuthGuard)
@Controller('sa')
export class SaController {
  constructor(private readonly saService: SaService) {}

  @Get('stats/overview')
  @ApiOperation({ summary: 'Global overview stats across all tenants' })
  @ApiOkResponse({ description: 'Returns global overview statistics', type: OverviewStatsDto })
  getOverview() {
    return this.saService.getOverviewStats();
  }

  @Get('tenants/:id/stats')
  @ApiOperation({ summary: 'Tenant-specific statistics' })
  @ApiParam({ name: 'id', description: 'Tenant ID (UUID)' })
  @ApiOkResponse({ description: 'Returns statistics for a specific tenant', type: TenantStatsDto })
  getTenantStats(@Param('id') tenantId: string) {
    return this.saService.getTenantStats(tenantId);
  }
}


