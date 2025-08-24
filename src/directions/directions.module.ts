import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { Direction } from './entities/direction.entity';
import { CertificateType } from '../certificate-types/entities/certificate-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Direction, CertificateType])],
  controllers: [DirectionsController],
  providers: [DirectionsService],
  exports: [DirectionsService],
})
export class DirectionsModule {}


