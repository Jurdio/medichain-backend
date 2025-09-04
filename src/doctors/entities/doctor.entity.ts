import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 200 })
  fullName: string;

  @Index(['tenantId', 'email'], { unique: true })
  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Index(['tenantId', 'walletAddress'], { unique: true })
  @Column({ type: 'varchar', length: 100 })
  walletAddress: string;

  @Column({ type: 'varchar', length: 120, nullable: true, select: false })
  passwordHash?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  specialization?: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @ManyToOne(() => Role, (role) => role.doctors, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role?: Role | null;

  @Column({ type: 'uuid', nullable: true })
  roleId?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


