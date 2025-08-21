import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VerifyService } from './verify.service';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { VerificationResponseDto } from './dto/verification-response.dto';

@ApiTags('verify')
@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @Post('transaction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify a Solana transaction for a MediCert NFT' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification result',
    type: VerificationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  async verifyTransaction(
    @Body() verifyTransactionDto: VerifyTransactionDto,
  ): Promise<VerificationResponseDto> {
    return this.verifyService.verifyTransaction(verifyTransactionDto);
  }
}
