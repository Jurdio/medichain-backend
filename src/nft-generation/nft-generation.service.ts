import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalCertificateEntity } from '../common/entities/medical-certificate.entity';
import { UsersService } from '../users/users.service';
import { SolanaService } from '../modules/solana/solana.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { NftResponseDto } from './dto/nft-response.dto';
import { CertificateStatus } from '../common/types';
import { PinataService } from '../shared/pinata.service';

@Injectable()
export class NftGenerationService {
  constructor(
    @InjectRepository(MedicalCertificateEntity)
    private readonly certificateRepository: Repository<MedicalCertificateEntity>,
    private readonly usersService: UsersService,
    private readonly solanaService: SolanaService,
    private readonly pinataService: PinataService,
  ) {}

  async createNft(createNftDto: CreateNftDto): Promise<NftResponseDto> {
    // Verify users exist
    const patient = await this.usersService.findUserByWalletAddress(createNftDto.patientWalletAddress);
    const doctor = await this.usersService.findUserByWalletAddress(createNftDto.doctorWalletAddress);

    // Create metadata for IPFS
    const metadata = {
      name: createNftDto.title,
      symbol: 'MEDCERT',
      description: createNftDto.description,
      image: createNftDto.imageUrl || '',
      attributes: [
        {
          trait_type: 'Certificate Type',
          value: createNftDto.certificateType,
        },
        {
          trait_type: 'Issue Date',
          value: createNftDto.issueDate,
        },
        {
          trait_type: 'Patient',
          value: createNftDto.patientWalletAddress,
        },
        {
          trait_type: 'Doctor',
          value: createNftDto.doctorWalletAddress,
        },
        ...(createNftDto.attributes || []),
      ],
      properties: {
        files: [
          {
            type: 'image/png',
            uri: createNftDto.imageUrl || '',
          },
        ],
        category: 'image',
      },
    };

    // Upload metadata to IPFS
    const metadataUrl = await this.pinataService.uploadMetadata(metadata);

    // Create certificate entity
    const certificate = this.certificateRepository.create({
      patientId: patient.id,
      doctorId: doctor.id,
      certificateType: createNftDto.certificateType,
      issueDate: new Date(createNftDto.issueDate),
      expiryDate: createNftDto.expiryDate ? new Date(createNftDto.expiryDate) : null,
      metadata: {
        title: createNftDto.title,
        description: createNftDto.description,
        imageUrl: createNftDto.imageUrl,
        attributes: metadata.attributes,
      },
      status: CertificateStatus.PENDING,
    });

    const savedCertificate = await this.certificateRepository.save(certificate);

    // Mint NFT on Solana
    const nftMintAddress = await this.solanaService.mintNft({
      metadataUrl,
      name: createNftDto.title,
      symbol: 'MEDCERT',
    });

    // Update certificate with NFT mint address
    savedCertificate.nftMintAddress = nftMintAddress;
          savedCertificate.status = CertificateStatus.ISSUED;
    await this.certificateRepository.save(savedCertificate);

    return this.mapToResponseDto(savedCertificate, metadataUrl);
  }

  async getNftById(id: string): Promise<NftResponseDto> {
    const certificate = await this.certificateRepository.findOne({ where: { id } });
    if (!certificate) {
      throw new NotFoundException('NFT not found');
    }

    const metadataUrl = await this.pinataService.getMetadataUrl(certificate.metadata);
    return this.mapToResponseDto(certificate, metadataUrl);
  }

  async getUserNfts(walletAddress: string): Promise<NftResponseDto[]> {
    const user = await this.usersService.findUserByWalletAddress(walletAddress);
    
    const certificates = await this.certificateRepository.find({
      where: [
        { patientId: user.id },
        { doctorId: user.id },
      ],
    });

    const nftResponses = await Promise.all(
      certificates.map(async (certificate) => {
        const metadataUrl = await this.pinataService.getMetadataUrl(certificate.metadata);
        return this.mapToResponseDto(certificate, metadataUrl);
      })
    );

    return nftResponses;
  }

  async verifyNftOwnership(nftMintAddress: string, walletAddress: string): Promise<boolean> {
    const certificate = await this.certificateRepository.findOne({
      where: { nftMintAddress },
    });

    if (!certificate) {
      throw new NotFoundException('NFT not found');
    }

    const user = await this.usersService.findUserByWalletAddress(walletAddress);
    return certificate.patientId === user.id || certificate.doctorId === user.id;
  }

  private mapToResponseDto(certificate: MedicalCertificateEntity, metadataUrl: string): NftResponseDto {
    return {
      id: certificate.id,
      nftMintAddress: certificate.nftMintAddress,
      status: certificate.status,
      metadataUrl,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    };
  }
}
