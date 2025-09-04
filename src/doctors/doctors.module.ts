import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './entities/doctor.entity';
import { RolesModule } from '../roles/roles.module';
import { HashingService } from '../common/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), RolesModule],
  controllers: [DoctorsController],
  providers: [DoctorsService, HashingService],
  exports: [DoctorsService],
})
export class DoctorsModule {}


