import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToMany, JoinTable } from 'typeorm';
import { Direction } from '../../directions/entities/direction.entity';

@Entity('certificate_types')
export class CertificateType {
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

  @ManyToMany(() => Direction, (dir) => dir.certificateTypes)
  @JoinTable({
    name: 'direction_certificate_types',
    joinColumn: { name: 'certificate_type_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'direction_id', referencedColumnName: 'id' },
  })
  directions?: Direction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


