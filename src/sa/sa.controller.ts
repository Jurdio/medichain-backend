import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SaService } from './sa.service';
import { SaJwtAuthGuard } from '../sa-auth/sa-jwt.guard';

@ApiTags('sa')
@ApiBearerAuth('sa-bearer')
@UseGuards(SaJwtAuthGuard)
@Controller('sa')
export class SaController {
  constructor(private readonly saService: SaService) {}

  @Get('stats/overview')
  @ApiOkResponse({ description: 'Global overview stats across all tenants' })
  getOverview() {
    return this.saService.getOverviewStats();
  }

  @Get('tenants/:id/stats')
  @ApiOkResponse({ description: 'Tenant specific stats' })
  getTenantStats(@Param('id') tenantId: string) {
    return this.saService.getTenantStats(tenantId);
  }
}


