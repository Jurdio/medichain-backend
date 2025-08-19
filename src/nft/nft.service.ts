import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
} from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';

@Injectable()
export class NftService {
  private readonly metaplex: Metaplex;
  private readonly connection: Connection;
  private readonly technicalWallet: Keypair;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL', 'https://api.devnet.solana.com');
    this.connection = new Connection(rpcUrl, 'confirmed');

    const secretKey = this.configService.get<string>('WALLET_SECRET_KEY');
    if (!secretKey) {
      throw new Error('WALLET_SECRET_KEY is not set in the environment variables.');
    }
    const secretKeyBytes = Buffer.from(secretKey, 'hex');
    this.technicalWallet = Keypair.fromSecretKey(secretKeyBytes);

    this.metaplex = Metaplex.make(this.connection)
      .use(keypairIdentity(this.technicalWallet))
      .use(
        irysStorage({
          address: 'https://devnet.irys.xyz',
          providerUrl: rpcUrl,
          timeout: 60000,
        }),
      );
  }

  async mintNft(
    recipientAddress: string,
    metadataUrl: string,
    name: string,
  ): Promise<{ nftAddress: string; signature: string }> {
    try {
      const recipientPublicKey = new PublicKey(recipientAddress);

      const result = await this.metaplex.nfts().create({
        uri: metadataUrl,
        name: name,
        sellerFeeBasisPoints: 500, // 5%
        tokenOwner: recipientPublicKey,
      });

      console.log(`Successfully minted NFT: ${result.nft.address.toBase58()}`);
      console.log(`Transaction signature: ${result.response.signature}`);
      
      return {
        nftAddress: result.nft.address.toBase58(),
        signature: result.response.signature,
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw new Error('Failed to mint NFT.');
    }
  }
}
