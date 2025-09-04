import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VerifyService } from './verify.service';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { VerificationResponseDto } from './dto/verification-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { TenantGuard } from '../common/tenant/tenant.guard';

@ApiTags('verify')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @Post('transaction')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('Documents', 'verify', 'save')
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
