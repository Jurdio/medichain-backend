import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { TenantGuard } from '../common/tenant/tenant.guard';

@ApiTags('history')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':doctorWalletAddress')
  @ApiOperation({ summary: 'Get transaction history for a doctor' })
  @ApiParam({ name: 'doctorWalletAddress', description: 'The wallet address of the doctor', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10, enum: [10, 50, 100] })
  @ApiQuery({ name: 'fromDate', required: false, type: String, description: 'Filter from date (inclusive), ISO string', example: '2024-01-01T00:00:00.000Z' })
  @ApiQuery({ name: 'toDate', required: false, type: String, description: 'Filter to date (inclusive), ISO string', example: '2024-12-31T23:59:59.999Z' })
  @ApiResponse({ status: 200, description: 'Returns the transaction history with pagination.' })
  @ApiResponse({ status: 404, description: 'No history found for this doctor.' })
  @RequirePermission('Documents', 'history', 'read')
  findAllByDoctor(
    @Param('doctorWalletAddress') doctorWalletAddress: string,
    @Query() { page = 1, limit = 10, fromDate, toDate }: PaginationQueryDto,
  ) {
    return this.historyService.findAllByDoctor(doctorWalletAddress, page, limit, fromDate, toDate);
  }
}
