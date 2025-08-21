import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { NftService } from '../nft/nft.service';
import { HistoryService } from '../history/history.service';

@Injectable()
export class ProtectService {
  constructor(
    private readonly nftService: NftService,
    private readonly historyService: HistoryService,
  ) {}
  async createCertificate(
    createCertificateDto: CreateCertificateDto,
    file: Express.Multer.File,
  ) {
    // 1. Upload file to IPFS/Arweave to get metadata URL
    // This is a placeholder. In a real application, you would upload the file
    // and metadata to a decentralized storage solution.
    const metadataUrl = `https://arweave.net/some-placeholder-tx-id-for-${file.originalname}`;
    const patientEmailPrefix = createCertificateDto.patientEmail.substring(0, 10);
    const certificateTitle = createCertificateDto.title ? createCertificateDto.title.substring(0, 15) : '';
    const nftName = `Cert - ${patientEmailPrefix}...${certificateTitle ? ' - ' + certificateTitle + '...' : ''}`.substring(0, 32);

    // 2. Mint the NFT
    const recipientWallet = createCertificateDto.manualWallet ?? createCertificateDto.doctorWalletAddress;
    const { nftAddress, signature } = await this.nftService.mintNft(
      recipientWallet,
      metadataUrl,
      nftName,
    );

    // 3. Save the transaction to the history database
    await this.historyService.create({
      transactionSignature: signature,
      nftMintAddress: nftAddress,
      doctorWalletAddress: createCertificateDto.doctorWalletAddress,
      patientWalletAddress: recipientWallet,
    });

    // 3. Optionally, save the certificate data and NFT address to your database
    console.log('Certificate created for:', createCertificateDto);
    console.log('File:', file.originalname);
    console.log('NFT Address:', nftAddress);

    return {
      message: 'Certificate created and NFT minted successfully',
      nftAddress,
      transactionSignature: signature,
      data: createCertificateDto,
      file: file.originalname,
    };
  }
}
