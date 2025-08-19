import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty()
  transactionSignature: string;

  @IsString()
  @IsNotEmpty()
  nftMintAddress: string;

  @IsString()
  @IsNotEmpty()
  doctorWalletAddress: string;

  @IsString()
  @IsNotEmpty()
  patientWalletAddress: string;
}
