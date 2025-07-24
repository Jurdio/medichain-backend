import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MedicalCertificateEntity } from './medical-certificate.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  publicKey: string;

  @Column({ nullable: true })
  walletAddress: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  role: 'patient' | 'doctor' | 'admin';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MedicalCertificateEntity, certificate => certificate.patient)
  patientCertificates: MedicalCertificateEntity[];

  @OneToMany(() => MedicalCertificateEntity, certificate => certificate.doctor)
  doctorCertificates: MedicalCertificateEntity[];
} 