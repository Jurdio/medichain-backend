import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCertificateTypeDto {
  @ApiProperty()
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 300)
  description?: string;

  @ApiPropertyOptional({ type: [String], description: 'Direction IDs to link' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  directionIds?: string[];
}


