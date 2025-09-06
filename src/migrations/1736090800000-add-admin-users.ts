import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class AddAdminUsers1736090800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'email', type: 'varchar', length: '320', isNullable: false, isUnique: true },
          { name: 'fullName', type: 'varchar', length: '200', isNullable: false },
          { name: 'passwordHash', type: 'varchar', length: '120', isNullable: false },
          { name: 'active', type: 'boolean', isNullable: false, default: true },
          { name: 'createdAt', type: 'timestamp with time zone', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp with time zone', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'admin_users',
      new TableIndex({ name: 'IDX_admin_users_email_unique', columnNames: ['email'], isUnique: true }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('admin_users', 'IDX_admin_users_email_unique');
    await queryRunner.dropTable('admin_users');
  }
}


