import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CertificateType } from '../../common/types';

export class CreateNftDto {
  @ApiProperty({ description: 'Patient wallet address' })
  @IsString()
  @IsNotEmpty()
  patientWalletAddress: string;

  @ApiProperty({ description: 'Doctor wallet address' })
  @IsString()
  @IsNotEmpty()
  doctorWalletAddress: string;

  @ApiProperty({ description: 'Certificate type', enum: CertificateType })
  @IsEnum(CertificateType)
  certificateType: CertificateType;

  @ApiProperty({ description: 'Certificate title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Certificate description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Certificate image URL' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Certificate issue date' })
  @IsDateString()
  issueDate: string;

  @ApiPropertyOptional({ description: 'Certificate expiry date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ description: 'Additional attributes for NFT' })
  @IsOptional()
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
} 