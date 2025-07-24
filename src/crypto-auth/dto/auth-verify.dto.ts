import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthVerifyDto {
  @ApiProperty({ description: 'Wallet address of the user' })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ description: 'Message that was signed' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Signature of the message' })
  @IsString()
  @IsNotEmpty()
  signature: string;
} 