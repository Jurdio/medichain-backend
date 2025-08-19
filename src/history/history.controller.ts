import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':doctorWalletAddress')
  @ApiOperation({ summary: 'Get transaction history for a doctor' })
  @ApiParam({ name: 'doctorWalletAddress', description: 'The wallet address of the doctor', type: String })
  @ApiResponse({ status: 200, description: 'Returns the transaction history.' })
  @ApiResponse({ status: 404, description: 'No history found for this doctor.' })
  findAllByDoctor(@Param('doctorWalletAddress') doctorWalletAddress: string) {
    return this.historyService.findAllByDoctor(doctorWalletAddress);
  }
}
