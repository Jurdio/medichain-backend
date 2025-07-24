import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NftGenerationService } from './nft-generation.service';
import { CreateNftDto } from './dto/create-nft.dto';
import { NftResponseDto } from './dto/nft-response.dto';
import { JwtAuthGuard } from '../crypto-auth/guards/jwt-auth.guard';

@ApiTags('nft-generation')
@Controller('nft-generation')
export class NftGenerationController {
  constructor(private readonly nftGenerationService: NftGenerationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new NFT certificate' })
  @ApiResponse({ status: 201, description: 'NFT created successfully', type: NftResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createNft(@Body() createNftDto: CreateNftDto): Promise<NftResponseDto> {
    return this.nftGenerationService.createNft(createNftDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get NFT by ID' })
  @ApiResponse({ status: 200, description: 'NFT found', type: NftResponseDto })
  @ApiResponse({ status: 404, description: 'NFT not found' })
  async getNftById(@Param('id') id: string): Promise<NftResponseDto> {
    return this.nftGenerationService.getNftById(id);
  }

  @Get('user/:walletAddress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all NFTs for a user' })
  @ApiResponse({ status: 200, description: 'User NFTs retrieved', type: [NftResponseDto] })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserNfts(@Param('walletAddress') walletAddress: string): Promise<NftResponseDto[]> {
    return this.nftGenerationService.getUserNfts(walletAddress);
  }

  @Get('verify/:nftMintAddress/:walletAddress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify NFT ownership' })
  @ApiResponse({ status: 200, description: 'Ownership verified', type: Boolean })
  @ApiResponse({ status: 404, description: 'NFT not found' })
  async verifyNftOwnership(
    @Param('nftMintAddress') nftMintAddress: string,
    @Param('walletAddress') walletAddress: string,
  ): Promise<{ isOwner: boolean }> {
    const isOwner = await this.nftGenerationService.verifyNftOwnership(nftMintAddress, walletAddress);
    return { isOwner };
  }

  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test for NFT generation module' })
  @ApiResponse({ status: 200, description: 'NFT generation module is working' })
  async smokeTest(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'NFT generation module is working correctly',
      timestamp: new Date().toISOString(),
    };
  }
}
