import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10, enum: [10, 50, 100] })
  @Type(() => Number)
  @IsInt()
  @IsIn([10, 50, 100])
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter from date (inclusive)', type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fromDate?: Date;

  @ApiPropertyOptional({ description: 'Filter to date (inclusive)', type: String, format: 'date-time', example: '2024-12-31T23:59:59.999Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  toDate?: Date;
}


