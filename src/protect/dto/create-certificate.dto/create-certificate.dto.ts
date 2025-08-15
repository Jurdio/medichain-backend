import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateCertificateDto {
  @IsEmail()
  @IsNotEmpty()
  patientEmail: string;

  @IsString()
  @IsNotEmpty()
  certificateType: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  // attachments will be handled by Multer, not directly in DTO
}
