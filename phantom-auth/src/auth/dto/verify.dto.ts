import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class VerifyDto {
    @IsString()
    @IsNotEmpty()
    pubkey: string;

    @IsArray()
    signature: number[];

    @IsString()
    @IsNotEmpty()
    nonce: string;
}
