import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @ApiPropertyOptional({ description: 'Activate/deactivate doctor' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


