import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedSecondTenant1736090600000 implements MigrationInterface {
  name = 'SeedSecondTenant1736090600000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tenants" ("id", "name", "slug")
      SELECT gen_random_uuid(), 'Clinic Beta', 'clinic-beta'
      WHERE NOT EXISTS (SELECT 1 FROM "tenants" WHERE slug = 'clinic-beta')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "tenants" WHERE slug = 'clinic-beta'`);
  }
}


