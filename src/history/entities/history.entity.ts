import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  tenantId: string;

  @Column()
  transactionSignature: string;

  @Column()
  nftMintAddress: string;

  @Column()
  doctorWalletAddress: string;

  @Column()
  patientWalletAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
