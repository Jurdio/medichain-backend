import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProtectModule } from './protect/protect.module';
import { HashingService } from './common/hashing/hashing.service';
import { SignerService } from './common/signer/signer.service';
import { SolanaService } from './common/solana/solana.service';
import { PrivyService } from './common/privy/privy.service';

@Module({
  imports: [ProtectModule, MulterModule.register({
    dest: './uploads', // Specify the destination folder for uploaded files
  })],
  controllers: [AppController],
  providers: [AppService, HashingService, SignerService, SolanaService, PrivyService],
})
export class AppModule {}
