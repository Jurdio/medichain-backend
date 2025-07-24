import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CertificateStatus } from '../../common/types';

export class NftResponseDto {
  @ApiProperty({ description: 'NFT unique identifier' })
  id: string;

  @ApiProperty({ description: 'NFT mint address on Solana' })
  nftMintAddress: string;

  @ApiProperty({ description: 'Certificate status' })
  status: CertificateStatus;

  @ApiProperty({ description: 'NFT metadata URL' })
  metadataUrl: string;

  @ApiProperty({ description: 'Certificate creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Certificate last update date' })
  updatedAt: Date;
} 