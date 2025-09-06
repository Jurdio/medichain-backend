import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaService } from './sa.service';
import { SaController } from './sa.controller';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { History } from '../history/entities/history.entity';
import { Direction } from '../directions/entities/direction.entity';
import { CertificateType } from '../certificate-types/entities/certificate-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Doctor, History, Direction, CertificateType])],
  controllers: [SaController],
  providers: [SaService],
})
export class SaModule {}


