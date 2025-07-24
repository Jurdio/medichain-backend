import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { SolanaModule } from './modules/solana/solana.module';
// import { User } from './users/entities/user.entity';
// import { MedicalCertificateEntity } from './common/entities/medical-certificate.entity';
import { UsersModule } from './users/users.module';
import { CryptoAuthModule } from './crypto-auth/crypto-auth.module';
import { NftGenerationModule } from './nft-generation/nft-generation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST', 'localhost'),
    //     port: configService.get('DB_PORT', 5432),
    //     username: configService.get('DB_USERNAME', 'postgres'),
    //     password: configService.get('DB_PASSWORD', 'password'),
    //     database: configService.get('DB_NAME', 'medichain'),
    //     entities: [User, MedicalCertificateEntity],
    //     synchronize: configService.get('NODE_ENV') !== 'production',
    //     logging: configService.get('NODE_ENV') !== 'production',
    //     retryAttempts: 3,
    //     retryDelay: 1000,
    //     keepConnectionAlive: false,
    //   }),
    //   inject: [ConfigService],
    // }),
    // SolanaModule,
    // UsersModule,
    // CryptoAuthModule,
    // NftGenerationModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 