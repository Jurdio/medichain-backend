import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SaLoginUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;
}

export class SaLoginRequestDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class SaLoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken!: string;

  @ApiProperty({ type: SaLoginUserDto })
  user!: SaLoginUserDto;
}


