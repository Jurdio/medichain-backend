import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CertificateType, CertificateStatus } from '../types';
import { User } from './user.entity';

@Entity('medical_certificates')
export class MedicalCertificateEntity {
  @ApiProperty({ description: 'Unique certificate identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Patient user ID' })
  @Column()
  patientId: string;

  @ApiProperty({ description: 'Doctor user ID' })
  @Column()
  doctorId: string;

  @ApiProperty({ description: 'Certificate type', enum: CertificateType })
  @Column({
    type: 'enum',
    enum: CertificateType,
  })
  certificateType: CertificateType;

  @ApiProperty({ description: 'Certificate issue date' })
  @Column({ type: 'timestamp' })
  issueDate: Date;

  @ApiProperty({ description: 'Certificate expiry date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @ApiProperty({ description: 'Certificate metadata' })
  @Column({ type: 'jsonb' })
  metadata: {
    title: string;
    description: string;
    imageUrl?: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };

  @ApiProperty({ description: 'NFT mint address on Solana', required: false })
  @Column({ nullable: true })
  nftMintAddress: string;

  @ApiProperty({ description: 'Certificate status', enum: CertificateStatus })
  @Column({
    type: 'enum',
    enum: CertificateStatus,
    default: CertificateStatus.PENDING,
  })
  status: CertificateStatus;

  @ApiProperty({ description: 'Certificate creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.patientCertificates)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @ManyToOne(() => User, user => user.doctorCertificates)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;
} 