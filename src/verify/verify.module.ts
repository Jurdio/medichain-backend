import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from '../nft/nft.module';
import { VerifyController } from './verify.controller';
import { VerifyService } from './verify.service';

@Module({
  imports: [ConfigModule, NftModule],
  controllers: [VerifyController],
  providers: [VerifyService],
})
export class VerifyModule {}
