import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('MediChain API')
    .setDescription(`
      Backend API for medical certificates with Solana NFT minting.
      
      ## Features
      - **Crypto Authentication**: Wallet-based authentication using Ed25519 signatures
      - **User Management**: Complete user profile management with wallet addresses
      - **NFT Generation**: Medical certificate NFT minting on Solana blockchain
      - **IPFS Integration**: Metadata storage on decentralized IPFS network
      
      ## Authentication Flow
      1. Request authentication message: POST /crypto-auth/request
      2. Sign message with wallet: Client-side signature generation
      3. Verify signature: POST /crypto-auth/verify
      4. Receive JWT token for API access
      
      ## Certificate Types
      - vaccination: Vaccination certificates
      - medical_examination: Medical examination reports
      - laboratory_test: Laboratory test results
      - prescription: Medical prescriptions
      - surgical_report: Surgical procedure reports
      
      ## Security
      - Ed25519 signature verification
      - JWT token authentication
      - Unique nonce for each authentication request
      - IPFS metadata storage for immutability
    `)
    .setVersion('1.0')
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.medichain.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Health', 'Health check endpoints')
    .addTag('users', 'User management operations')
    .addTag('crypto-auth', 'Cryptographic wallet authentication')
    .addTag('nft-generation', 'NFT certificate generation and management')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'MediChain API Documentation',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap(); 