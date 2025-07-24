import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftGenerationService } from './nft-generation.service';
import { NftGenerationController } from './nft-generation.controller';
import { MedicalCertificateEntity } from '../common/entities/medical-certificate.entity';
import { UsersModule } from '../users/users.module';
import { SolanaModule } from '../modules/solana/solana.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalCertificateEntity]),
    UsersModule,
    SolanaModule,
    SharedModule,
  ],
  controllers: [NftGenerationController],
  providers: [NftGenerationService],
  exports: [NftGenerationService],
})
export class NftGenerationModule {}
