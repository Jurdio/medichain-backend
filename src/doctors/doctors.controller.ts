import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorsDto } from './dto/query-doctors.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a doctor' })
  @ApiResponse({ status: 201, description: 'Doctor created' })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'List doctors with pagination and search' })
  findAll(@Query() query: QueryDoctorsDto) {
    return this.doctorsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.doctorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update doctor by id' })
  @ApiParam({ name: 'id', type: String })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete doctor by id' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.doctorsService.remove(id);
  }
}


