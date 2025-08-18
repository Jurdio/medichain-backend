import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { NftService } from '../nft/nft.service';

@Injectable()
export class ProtectService {
  constructor(private readonly nftService: NftService) {}
  async createCertificate(
    createCertificateDto: CreateCertificateDto,
    file: Express.Multer.File,
  ) {
    // 1. Upload file to IPFS/Arweave to get metadata URL
    // This is a placeholder. In a real application, you would upload the file
    // and metadata to a decentralized storage solution.
    const metadataUrl = `https://arweave.net/some-placeholder-tx-id-for-${file.originalname}`;
    const nftName = `Certificate for ${createCertificateDto.patientEmail}`;

    // 2. Mint the NFT
    const nftAddress = await this.nftService.mintNft(
      createCertificateDto.manualWallet,
      metadataUrl,
      nftName,
    );

    // 3. Optionally, save the certificate data and NFT address to your database
    console.log('Certificate created for:', createCertificateDto);
    console.log('File:', file.originalname);
    console.log('NFT Address:', nftAddress);

    return {
      message: 'Certificate created and NFT minted successfully',
      nftAddress,
      data: createCertificateDto,
      file: file.originalname,
    };
  }
}
