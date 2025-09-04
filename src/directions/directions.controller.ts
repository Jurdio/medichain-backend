import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { PaginationQueryDto } from '../history/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { TenantGuard } from '../common/tenant/tenant.guard';

@ApiTags('directions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post()
  @RequirePermission('Documents', 'directions', 'save')
  create(@Body() dto: CreateDirectionDto) {
    return this.directionsService.create(dto);
  }

  @Get()
  @RequirePermission('Documents', 'directions', 'read')
  findAll(@Query() query: PaginationQueryDto) {
    return this.directionsService.findAll(query);
  }

  @Get(':id')
  @RequirePermission('Documents', 'directions', 'read')
  findOne(@Param('id') id: string) {
    return this.directionsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('Documents', 'directions', 'save')
  update(@Param('id') id: string, @Body() dto: UpdateDirectionDto) {
    return this.directionsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('Documents', 'directions', 'save')
  remove(@Param('id') id: string) {
    return this.directionsService.remove(id);
  }
}


