import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  fullName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320, unique: true })
  email: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  walletAddress: string;

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


