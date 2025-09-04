import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CertificateTypesService } from './certificate-types.service';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { PaginationQueryDto } from '../history/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { TenantGuard } from '../common/tenant/tenant.guard';

@ApiTags('certificate-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('certificate-types')
export class CertificateTypesController {
  constructor(private readonly certificateTypesService: CertificateTypesService) {}

  @Post()
  @RequirePermission('Documents', 'certificateTypes', 'save')
  create(@Body() dto: CreateCertificateTypeDto) {
    return this.certificateTypesService.create(dto);
  }

  @Get()
  @RequirePermission('Documents', 'certificateTypes', 'read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.certificateTypesService.findAll(query);
  }

  @Get(':id')
  @RequirePermission('Documents', 'certificateTypes', 'read')
  findOne(@Param('id') id: string) {
    return this.certificateTypesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('Documents', 'certificateTypes', 'save')
  update(@Param('id') id: string, @Body() dto: UpdateCertificateTypeDto) {
    return this.certificateTypesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('Documents', 'certificateTypes', 'save')
  remove(@Param('id') id: string) {
    return this.certificateTypesService.remove(id);
  }
}


