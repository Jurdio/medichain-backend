import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ description: 'Full name (ПІБ) of the doctor' })
  @IsString()
  @Length(2, 200)
  fullName: string;

  @ApiProperty({ description: 'Email address of the doctor' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Wallet address of the doctor' })
  @IsString()
  @Length(20, 100)
  walletAddress: string;

  @ApiPropertyOptional({ description: 'Phone number of the doctor' })
  @IsOptional()
  @IsString()
  @Matches(/^[+\d][\d\-()\s]{6,19}$/)
  phone?: string;

  @ApiPropertyOptional({ description: 'Medical specialization' })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  specialization?: string;
}


