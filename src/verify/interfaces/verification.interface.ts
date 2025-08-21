export type VerificationStatus = 'FOUND' | 'NOT_FOUND' | 'AMBIGUOUS' | 'ERROR';

export interface VerificationDetails {
  matchedMints: string[];
  network: 'devnet' | 'mainnet-beta' | 'testnet' | 'custom';
  candidates?: {
    mint: string;
    isMediCertOrigin: boolean;
    updateAuthority?: string;
    error?: string;
  }[];
  error?: string;
}

export interface VerificationResponse {
  status: VerificationStatus;
  details: VerificationDetails;
}
