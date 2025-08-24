import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToMany } from 'typeorm';
import { CertificateType } from '../../certificate-types/entities/certificate-type.entity';

@Entity('directions')
export class Direction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120, unique: true })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description?: string;

  @ManyToMany(() => CertificateType, (ct) => ct.directions)
  certificateTypes?: CertificateType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


