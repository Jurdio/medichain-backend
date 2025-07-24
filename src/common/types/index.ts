export interface WalletAuthRequest {
  publicKey: string;
  signature: string;
  message: string;
}

export interface JwtPayload {
  publicKey: string;
  sub: string;
  iat?: number;
  exp?: number;
}

export interface MedicalCertificate {
  id: string;
  patientId: string;
  doctorId: string;
  certificateType: CertificateType;
  issueDate: Date;
  expiryDate?: Date;
  metadata: CertificateMetadata;
  nftMintAddress?: string;
  status: CertificateStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateMetadata {
  title: string;
  description: string;
  imageUrl?: string;
  attributes: CertificateAttribute[];
}

export interface CertificateAttribute {
  trait_type: string;
  value: string | number;
}

export enum CertificateType {
  VACCINATION = 'vaccination',
  MEDICAL_EXAMINATION = 'medical_examination',
  LABORATORY_TEST = 'laboratory_test',
  PRESCRIPTION = 'prescription',
  SURGICAL_REPORT = 'surgical_report',
}

export enum CertificateStatus {
  PENDING = 'pending',
  ISSUED = 'issued',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export interface SolanaConfig {
  rpcUrl: string;
  network: 'mainnet-beta' | 'testnet' | 'devnet';
  programId: string;
}

export interface NftMintResult {
  mintAddress: string;
  txHash: string;
  metadataUri: string;
} 