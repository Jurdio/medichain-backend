import { Controller, Get, Param, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':doctorWalletAddress')
  @ApiOperation({ summary: 'Get transaction history for a doctor' })
  @ApiParam({ name: 'doctorWalletAddress', description: 'The wallet address of the doctor', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10, enum: [10, 50, 100] })
  @ApiResponse({ status: 200, description: 'Returns the transaction history with pagination.' })
  @ApiResponse({ status: 404, description: 'No history found for this doctor.' })
  findAllByDoctor(
    @Param('doctorWalletAddress') doctorWalletAddress: string,
    @Query() { page = 1, limit = 10 }: PaginationQueryDto,
  ) {
    return this.historyService.findAllByDoctor(doctorWalletAddress, page, limit);
  }
}
