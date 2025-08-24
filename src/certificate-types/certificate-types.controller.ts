import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CertificateTypesService } from './certificate-types.service';
import { CreateCertificateTypeDto } from './dto/create-certificate-type.dto';
import { UpdateCertificateTypeDto } from './dto/update-certificate-type.dto';
import { PaginationQueryDto } from '../history/dto/pagination-query.dto';

@ApiTags('certificate-types')
@Controller('certificate-types')
export class CertificateTypesController {
  constructor(private readonly certificateTypesService: CertificateTypesService) {}

  @Post()
  create(@Body() dto: CreateCertificateTypeDto) {
    return this.certificateTypesService.create(dto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.certificateTypesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificateTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCertificateTypeDto) {
    return this.certificateTypesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificateTypesService.remove(id);
  }
}


