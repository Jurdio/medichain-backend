import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';

export type PermissionActions = {
  read: boolean;
  save: boolean;
};

export type ModulePermissions = Record<string, PermissionActions>;

@Entity('roles')
export class Role {
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

  // Permissions grouped by domains (e.g., Users, Documents) and modules
  @Column({ type: 'jsonb' })
  permissions: {
    Users?: ModulePermissions; // e.g., doctors under Users
    Documents?: ModulePermissions; // e.g., settings, protect, history, verify, roles, directions, certificates
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Doctor, (doctor) => doctor.role)
  doctors?: Doctor[];
}


