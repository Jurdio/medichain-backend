import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class QueryDoctorsDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10, enum: [10, 50, 100] })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search string across fullName, email, wallet' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by email (exact)' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Filter by wallet address (exact)' })
  @IsOptional()
  @IsString()
  walletAddress?: string;
}


