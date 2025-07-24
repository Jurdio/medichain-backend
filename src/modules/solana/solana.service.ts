import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

export interface MintNftParams {
  metadataUrl: string;
  name: string;
  symbol: string;
}

@Injectable()
export class SolanaService {
  private connection: Connection;
  private metaplex: Metaplex;
  private mintAuthority: Keypair;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL') || 'https://api.devnet.solana.com';
    const privateKey = this.configService.get<string>('SOLANA_PRIVATE_KEY');
    
    this.connection = new Connection(rpcUrl, 'confirmed');
    
    if (privateKey) {
      this.mintAuthority = Keypair.fromSecretKey(
        Buffer.from(JSON.parse(privateKey))
      );
    } else {
      // Generate a new keypair for development
      this.mintAuthority = Keypair.generate();
    }

    this.metaplex = new Metaplex(this.connection);
  }

  async mintNft(params: MintNftParams): Promise<string> {
    try {
      const { metadataUrl, name, symbol } = params;

      const { nft } = await this.metaplex.nfts().create({
        uri: metadataUrl,
        name,
        symbol,
        sellerFeeBasisPoints: 500, // 5%
        creators: [
          {
            address: this.mintAuthority.publicKey,
            share: 100,
          },
        ],
        isMutable: true,
        maxSupply: 1,
      });

      return nft.address.toString();
    } catch (error) {
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  async getNftMetadata(mintAddress: string): Promise<any> {
    try {
      const mint = new PublicKey(mintAddress);
      const nft = await this.metaplex.nfts().findByMint({ mintAddress: mint });
      return nft;
    } catch (error) {
      throw new Error(`Failed to get NFT metadata: ${error.message}`);
    }
  }

  async transferNft(
    mintAddress: string,
    fromWallet: string,
    toWallet: string,
  ): Promise<string> {
    try {
      const mint = new PublicKey(mintAddress);
      const from = new PublicKey(fromWallet);
      const to = new PublicKey(toWallet);

      const { response } = await this.metaplex.nfts().transfer({
        nftOrSft: await this.metaplex.nfts().findByMint({ mintAddress: mint }),
        fromOwner: from,
        toOwner: to,
      });

      return response.signature;
    } catch (error) {
      throw new Error(`Failed to transfer NFT: ${error.message}`);
    }
  }

  async getConnection(): Promise<Connection> {
    return this.connection;
  }

  async getMintAuthority(): Promise<Keypair> {
    return this.mintAuthority;
  }
} 