import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProtectModule } from './protect/protect.module';
import { HashingService } from './common/hashing/hashing.service';
import { SignerService } from './common/signer/signer.service';
import { SolanaService } from './common/solana/solana.service';
import { PrivyService } from './common/privy/privy.service';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProtectModule,
    MulterModule.register({
      dest: './uploads', // Specify the destination folder for uploaded files
    }),
    NftModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HashingService,
    SignerService,
    SolanaService,
    PrivyService,
  ],
})
export class AppModule {}
