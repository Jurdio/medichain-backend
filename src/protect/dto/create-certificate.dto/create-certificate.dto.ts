import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificateDto {
  @ApiProperty({
    description: 'Wallet address of the doctor issuing the certificate',
    example: '6vdaANCiHoDVSidCWddiAwHqGDKUZDCuVHeJ1AqD9NMq',
  })
  @IsString()
  @IsNotEmpty()
  doctorWalletAddress: string;

  @ApiProperty({
    description: 'Email of the patient',
    example: 'patient@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  patientEmail: string;

  @ApiProperty({
    description: 'Manual wallet address of the user',
    example: '6vdaANCiHoDVSidCWddiAwHqGDKUZDCuVHeJ1AqD9NMq',
    required: false,
  })
  @IsOptional()
  @IsString()
  manualWallet?: string;

  @ApiProperty({
    description: 'Optional attachments related to the certificate',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  attachments?: any;

  @ApiProperty({
    description: 'Type of certificate',
    example: 'Medical Certificate',
    required: false,
  })
  @IsOptional()
  @IsString()
  certificateType?: string;

  @ApiProperty({
    description: 'Title of the certificate',
    example: 'Health Certificate',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the certificate',
    example: 'This certificate confirms the patient\'s health status.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Issue date of the certificate',
    example: '2023-10-27',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;
}
