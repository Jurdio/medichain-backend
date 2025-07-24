import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const PinataSDK = require('@pinata/sdk');

@Injectable()
export class PinataService {
  private pinata: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('PINATA_API_KEY');
    const secretKey = this.configService.get<string>('PINATA_SECRET_KEY');
    
    if (!apiKey || !secretKey) {
      throw new Error('Pinata API credentials not configured');
    }

    this.pinata = new (PinataSDK as any)(apiKey, secretKey);
  }

  async uploadMetadata(metadata: any): Promise<string> {
    try {
      const result = await this.pinata.pinJSONToIPFS(metadata);
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const result = await this.pinata.pinFileToIPFS(fileBuffer, {
        pinataMetadata: {
          name: fileName,
        },
      });
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    }
  }

  async getMetadataUrl(metadata: any): Promise<string> {
    // For now, return a placeholder URL
    // In a real implementation, you would upload the metadata and return the IPFS URL
    return 'ipfs://placeholder-hash';
  }
} 