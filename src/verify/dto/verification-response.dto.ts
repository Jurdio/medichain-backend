import { ApiProperty } from '@nestjs/swagger';
import {
  VerificationResponse,
  VerificationStatus,
  VerificationDetails,
} from '../interfaces/verification.interface';

class VerificationCandidateDto {
  @ApiProperty()
  mint: string;

  @ApiProperty()
  isMediCertOrigin: boolean;

  @ApiProperty({ required: false })
  updateAuthority?: string;

  @ApiProperty({ required: false })
  error?: string;
}

class VerificationDetailsDto implements VerificationDetails {
  @ApiProperty({ type: [String] })
  matchedMints: string[];

  @ApiProperty({ enum: ['devnet', 'mainnet-beta', 'testnet', 'custom'] })
  network: 'devnet' | 'mainnet-beta' | 'testnet' | 'custom';

  @ApiProperty({ type: [VerificationCandidateDto], required: false })
  candidates?: VerificationCandidateDto[];

  @ApiProperty({ required: false })
  error?: string;
}

export class VerificationResponseDto implements VerificationResponse {
  @ApiProperty({ enum: ['FOUND', 'NOT_FOUND', 'AMBIGUOUS', 'ERROR'] })
  status: VerificationStatus;

  @ApiProperty({ type: VerificationDetailsDto })
  details: VerificationDetailsDto;
}
