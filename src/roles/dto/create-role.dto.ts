import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionActionsDto } from './permission-actions.dto';

class ModulePermissionsDto {
  [key: string]: PermissionActionsDto;
}

class GroupedPermissionsDto {
  @ApiProperty({ type: () => ModulePermissionsDto, required: false, description: 'Domain for user related modules, e.g., doctors' })
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: false })
  @Type(() => ModulePermissionsDto)
  Users?: ModulePermissionsDto;

  @ApiProperty({ type: () => ModulePermissionsDto, required: false, description: 'Domain for document related modules, e.g., settings, protect, history, verify, roles, directions, certificates' })
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: false })
  @Type(() => ModulePermissionsDto)
  Documents?: ModulePermissionsDto;
}

export class CreateRoleDto {
  @ApiProperty({ example: 'Administrator' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  name: string;

  @ApiProperty({ example: 'administrator' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  description?: string;

  @ApiProperty({ type: () => GroupedPermissionsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => GroupedPermissionsDto)
  permissions: GroupedPermissionsDto;
}


