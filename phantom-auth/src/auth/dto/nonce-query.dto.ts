import { IsString, IsNotEmpty, Length } from "class-validator";

export class NonceQueryDto {
    @IsString()
    @IsNotEmpty()
    @Length(32, 44)         // Solana pubkey = 32 bytes ≈ 44 base58 символів
    pubkey: string;
}
