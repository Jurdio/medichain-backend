import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProtectModule } from './protect/protect.module';
import { HistoryModule } from './history/history.module';
import { HashingService } from './common/hashing/hashing.service';
import { SignerService } from './common/signer/signer.service';
import { SolanaService } from './common/solana/solana.service';
import { PrivyService } from './common/privy/privy.service';
import { NftModule } from './nft/nft.module';
import { VerifyModule } from './verify/verify.module';
import { DoctorsModule } from './doctors/doctors.module';
import { RolesModule } from './roles/roles.module';
import { DirectionsModule } from './directions/directions.module';
import { CertificateTypesModule } from './certificate-types/certificate-types.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Be careful with this in production
      }),
    }),
    ProtectModule,
    HistoryModule,
    MulterModule.register({
      dest: './uploads', // Specify the destination folder for uploaded files
    }),
    NftModule,
    VerifyModule,
    DoctorsModule,
    RolesModule,
    DirectionsModule,
    CertificateTypesModule,
    UsersModule,
    AuthModule,
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
