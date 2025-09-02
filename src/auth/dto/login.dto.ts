import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty({ description: 'User email address used to login' })
  @IsEmail()
  email: string;
}


