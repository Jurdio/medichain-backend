import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MedicalCertificateEntity } from '../../common/entities/medical-certificate.entity';

export class UserProfile {
  @ApiProperty({ description: 'User first name', required: false })
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false })
  lastName?: string;

  @ApiProperty({ description: 'User email address', required: false })
  email?: string;

  @ApiProperty({ description: 'User phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'User date of birth', required: false })
  dateOfBirth?: Date;
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique user identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User wallet address (unique)' })
  @Column({ unique: true, nullable: false })
  walletAddress: string;

  @ApiProperty({ description: 'User profile information', required: false })
  @Column({ type: 'jsonb', nullable: true })
  profile: UserProfile;

  @ApiProperty({ description: 'Whether user is verified', default: false })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Authentication nonce', required: false })
  @Column({ nullable: true })
  nonce: string;

  @ApiProperty({ description: 'Last login timestamp', required: false })
  @Column({ nullable: true })
  lastLoginAt: Date;

  @ApiProperty({ description: 'User creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MedicalCertificateEntity, certificate => certificate.patient)
  patientCertificates: MedicalCertificateEntity[];

  @OneToMany(() => MedicalCertificateEntity, certificate => certificate.doctor)
  doctorCertificates: MedicalCertificateEntity[];
} 