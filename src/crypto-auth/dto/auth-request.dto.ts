import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRequestDto {
  @ApiProperty({ description: 'Wallet address of the user' })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
} 