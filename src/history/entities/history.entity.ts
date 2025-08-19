import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
