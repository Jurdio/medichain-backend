import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PermissionActionsDto {
  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  read: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  save: boolean;
}


