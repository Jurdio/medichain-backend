import { Module } from '@nestjs/common';
import { ProtectController } from './protect.controller';
import { ProtectService } from './protect.service';
import { NftModule } from '../nft/nft.module';
import { NftService } from '../nft/nft.service';

@Module({
  imports: [NftModule],
  controllers: [ProtectController],
  providers: [ProtectService, NftService],
})
export class ProtectModule {}
