import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateTypesService } from './certificate-types.service';
import { CertificateTypesController } from './certificate-types.controller';
import { CertificateType } from './entities/certificate-type.entity';
import { Direction } from '../directions/entities/direction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CertificateType, Direction])],
  controllers: [CertificateTypesController],
  providers: [CertificateTypesService],
  exports: [CertificateTypesService],
})
export class CertificateTypesModule {}


