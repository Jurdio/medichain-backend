import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto/create-certificate.dto';
import { NftService } from '../nft/nft.service';
import { PrivyService } from '../common/privy/privy.service';
import { HistoryService } from '../history/history.service';

@Injectable()
export class ProtectService {
  constructor(
    private readonly nftService: NftService,
    private readonly historyService: HistoryService,
    private readonly privyService: PrivyService,
  ) {}
  async createCertificate(
    createCertificateDto: CreateCertificateDto,
    file: Express.Multer.File,
  ) {
    // 1. Build minimal metadata JSON (no files, no email, no title/description)
    const nftName = 'MediCert';
    const network = this.nftService.getNetwork();
    const metadata = {
      name: nftName,
      symbol: 'MEDICERT',
      seller_fee_basis_points: 0,
      attributes: [
        {
          trait_type: 'certificate_type',
          value: createCertificateDto.certificateType ?? 'generic',
        },
        ...(createCertificateDto.issueDate
          ? [
              {
                trait_type: 'issue_date',
                value: createCertificateDto.issueDate,
              },
            ]
          : []),
        {
          trait_type: 'network',
          value: network,
        },
        {
          trait_type: 'version',
          value: '1.0',
        },
      ],
    } as Record<string, unknown>;

    const metadataUrl = await this.nftService.uploadJsonMetadata(metadata);

    // 2. Mint the NFT
    let recipientWallet = createCertificateDto.manualWallet ?? null;
    if (!recipientWallet) {
      // Try resolving via Privy by patient email
      recipientWallet = (await this.privyService.getPrimaryWalletByEmail(createCertificateDto.patientEmail)) ?? null;
    }
    if (!recipientWallet) {
      throw new NotFoundException('Wallet not found by email');
    }
    const { nftAddress, signature } = await this.nftService.mintNft(
      recipientWallet,
      metadataUrl,
      nftName,
      0,
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
    console.log('NFT Address:', nftAddress);

    return {
      message: 'Certificate created and NFT minted successfully',
      nftAddress,
      transactionSignature: signature,
      data: createCertificateDto,
      file: file?.originalname,
    };
  }
}
