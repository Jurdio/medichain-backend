import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    walletAddress: string;
    isVerified: boolean;
  };

  @ApiProperty({ description: 'Message to sign for authentication' })
  message?: string;
} 