import { Module } from '@nestjs/common';
import { ProtectController } from './protect.controller';
import { ProtectService } from './protect.service';
import { NftModule } from '../nft/nft.module';
import { NftService } from '../nft/nft.service';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [NftModule, HistoryModule],
  controllers: [ProtectController],
  providers: [ProtectService, NftService],
})
export class ProtectModule {}
