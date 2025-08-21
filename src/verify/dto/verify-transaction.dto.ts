import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTransactionDto {
  @ApiProperty({
    description: 'The Solana transaction signature (tx hash)',
    example:
      '5vJACtP8e5fA5vzHqefY5n1gGF5uE1sVzXwQh8sZ8zHj6sWdJ7kYpDqA3cE8gH7kZ5mN6sB3dF2jC1xVzXyY9z',
  })
  @IsString()
  @IsNotEmpty()
  txHash: string;
}
