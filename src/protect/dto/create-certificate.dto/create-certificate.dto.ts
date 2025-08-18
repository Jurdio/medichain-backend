import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificateDto {
  @ApiProperty({ description: 'Email of the patient', example: 'patient@example.com' })
  @IsEmail()
  @IsNotEmpty()
  patientEmail: string;

  @ApiProperty({ description: 'Type of certificate', example: 'sick-leave' })
  @IsString()
  @IsNotEmpty()
  certificateType: string;

  @ApiProperty({ description: 'Title of the certificate', example: 'Medical Certificate' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the certificate', example: 'Certificate for sick leave due to flu.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Issue date of the certificate', example: '2025-08-14' })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  // attachments will be handled by Multer, not directly in DTO
}
