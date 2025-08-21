import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Metaplex, MetaplexError } from '@metaplex-foundation/js';
import {
  PublicKey,
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PartiallyDecodedInstruction,
  Connection,
} from '@solana/web3.js';
import { NftService } from '../nft/nft.service';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import {
  VerificationResponse,
  VerificationDetails,
} from './interfaces/verification.interface';

const TOKEN_METADATA_PROGRAM_ID =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

type VerificationCandidate = NonNullable<VerificationDetails['candidates']>[0];

@Injectable()
export class VerifyService {
  private readonly logger = new Logger(VerifyService.name);
  private readonly metaplex: Metaplex;
  private readonly connection: Connection;
  private readonly mediCertUpdateAuthority: string;

  constructor(
    private readonly nftService: NftService,
    private readonly configService: ConfigService,
  ) {
    this.metaplex = this.nftService.getMetaplexInstance();
    this.connection = this.nftService.getConnection();

    const updateAuthority = this.configService.get<string>(
      'MEDICERT_UPDATE_AUTHORITY',
    );
    if (!updateAuthority) {
      throw new Error(
        'MEDICERT_UPDATE_AUTHORITY is not set in the environment variables.',
      );
    }
    this.mediCertUpdateAuthority = updateAuthority;
  }

  async verifyTransaction(
    verifyTransactionDto: VerifyTransactionDto,
  ): Promise<VerificationResponse> {
    const { txHash } = verifyTransactionDto;
    const network = this.nftService.getNetwork();
    const baseDetails: {
      network: typeof network;
      candidates: VerificationCandidate[];
    } = {
      network,
      candidates: [],
    };

    try {
      const tx = await this.connection.getParsedTransaction(txHash, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        this.logger.warn(`Transaction not found: ${txHash}`);
        return {
          status: 'NOT_FOUND',
          details: { ...baseDetails, matchedMints: [] },
        };
      }

      const mintCandidates = this.extractMintCandidatesFromTx(tx);
      if (mintCandidates.size === 0) {
        this.logger.log(`No potential NFT mints found in tx: ${txHash}`);
        return {
          status: 'NOT_FOUND',
          details: { ...baseDetails, matchedMints: [] },
        };
      }

      this.logger.log(
        `Found ${mintCandidates.size} potential mint(s) in tx ${txHash}`,
      );

      const verificationPromises = Array.from(mintCandidates).map((mint) =>
        this.verifyMint(mint),
      );

      const results = await Promise.all(verificationPromises);

      const matchedMints: string[] = [];
      results.forEach((res) => {
        baseDetails.candidates.push(res.details);
        if (res.isMatch) {
          matchedMints.push(res.details.mint);
        }
      });

      if (matchedMints.length === 1) {
        return { status: 'FOUND', details: { ...baseDetails, matchedMints } };
      }
      if (matchedMints.length > 1) {
        return {
          status: 'AMBIGUOUS',
          details: { ...baseDetails, matchedMints },
        };
      }
      return {
        status: 'NOT_FOUND',
        details: { ...baseDetails, matchedMints: [] },
      };
    } catch (error) {
      this.logger.error(
        `Error processing transaction ${txHash}: ${error.message}`,
        error.stack,
      );
      return {
        status: 'ERROR',
        details: {
          ...baseDetails,
          matchedMints: [],
          error: error.message || 'An unexpected error occurred.',
        },
      };
    }
  }

  private extractMintCandidatesFromTx(
    tx: ParsedTransactionWithMeta,
  ): Set<string> {
    const mints = new Set<string>();

    const instructions = tx.transaction.message.instructions;
    const allInstructions = [
      ...instructions,
      ...(tx.meta?.innerInstructions ?? []).flatMap((i) => i.instructions),
    ];

    for (const inst of allInstructions) {
      if (inst.programId.toBase58() === TOKEN_METADATA_PROGRAM_ID) {
        // Heuristic: In 'createMetadataAccountV3', the mint is usually the 2nd account
        if ('parsed' in inst && inst.parsed?.type === 'createMetadataAccountV3' && inst.parsed?.info?.mint) {
          mints.add(inst.parsed.info.mint);
        } else if ('accounts' in inst) {
          // Fallback for other instructions: check accounts
          for (const account of (inst as PartiallyDecodedInstruction).accounts) {
            mints.add(account.toBase58());
          }
        }
      }
    }

    return mints;
  }

  private async verifyMint(
    mintAddress: string,
  ): Promise<{ isMatch: boolean; details: VerificationCandidate }> {
    const details: VerificationCandidate = {
      mint: mintAddress,
      isMediCertOrigin: false,
    };

    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const nft = await this.metaplex
        .nfts()
        .findByMint({ mintAddress: mintPublicKey });

      if (nft.updateAuthorityAddress) {
        details.updateAuthority = nft.updateAuthorityAddress.toBase58();
        if (
          nft.updateAuthorityAddress.toBase58() === this.mediCertUpdateAuthority
        ) {
          details.isMediCertOrigin = true;
          return { isMatch: true, details };
        }
      }
    } catch (error) {
      if (error instanceof MetaplexError) {
        const reason = error.cause instanceof Error ? error.cause.message : 'Unknown';
        this.logger.debug(
          `Skipping candidate ${mintAddress}: Not a valid Metaplex NFT. Reason: ${reason}`,
        );
        details.error = `Not a valid Metaplex NFT: ${reason}`;
      } else {
        this.logger.warn(
          `Unexpected error verifying mint ${mintAddress}: ${error.message}`,
        );
        details.error = error.message;
      }
    }

    return { isMatch: false, details };
  }
}
