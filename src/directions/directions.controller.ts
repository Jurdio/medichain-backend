import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';

@ApiTags('directions')
@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post()
  create(@Body() dto: CreateDirectionDto) {
    return this.directionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.directionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDirectionDto) {
    return this.directionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directionsService.remove(id);
  }
}


