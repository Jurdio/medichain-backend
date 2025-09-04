import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'Clinic Alpha' })
  @IsString()
  @Length(2, 200)
  name: string;

  @ApiProperty({ example: 'clinic-alpha' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(2, 200)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 300)
  description?: string;
}


