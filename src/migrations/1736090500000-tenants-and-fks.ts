import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantsAndFks1736090500000 implements MigrationInterface {
  name = 'TenantsAndFks1736090500000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tenants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(200) UNIQUE NOT NULL,
        "slug" varchar(200) UNIQUE NOT NULL,
        "description" varchar(300),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Seed a default tenant if none exists
    await queryRunner.query(`
      INSERT INTO "tenants" ("id", "name", "slug")
      SELECT gen_random_uuid(), 'Default Clinic', 'default-clinic'
      WHERE NOT EXISTS (SELECT 1 FROM "tenants" WHERE slug = 'default-clinic')
    `);

    // For any orphan tenantIds not present in tenants, map them to Default Clinic
    await queryRunner.query(`
      WITH def AS (SELECT id FROM tenants WHERE slug = 'default-clinic')
      UPDATE roles SET "tenantId" = (SELECT id FROM def) WHERE NOT EXISTS (SELECT 1 FROM tenants t WHERE t.id = roles."tenantId")
    `);
    await queryRunner.query(`
      WITH def AS (SELECT id FROM tenants WHERE slug = 'default-clinic')
      UPDATE doctors SET "tenantId" = (SELECT id FROM def) WHERE NOT EXISTS (SELECT 1 FROM tenants t WHERE t.id = doctors."tenantId")
    `);
    await queryRunner.query(`
      WITH def AS (SELECT id FROM tenants WHERE slug = 'default-clinic')
      UPDATE directions SET "tenantId" = (SELECT id FROM def) WHERE NOT EXISTS (SELECT 1 FROM tenants t WHERE t.id = directions."tenantId")
    `);
    await queryRunner.query(`
      WITH def AS (SELECT id FROM tenants WHERE slug = 'default-clinic')
      UPDATE certificate_types SET "tenantId" = (SELECT id FROM def) WHERE NOT EXISTS (SELECT 1 FROM tenants t WHERE t.id = certificate_types."tenantId")
    `);
    await queryRunner.query(`
      WITH def AS (SELECT id FROM tenants WHERE slug = 'default-clinic')
      UPDATE history SET "tenantId" = (SELECT id FROM def) WHERE NOT EXISTS (SELECT 1 FROM tenants t WHERE t.id = history."tenantId")
    `);

    // Add FKs
    await queryRunner.query(`ALTER TABLE "doctors" ADD CONSTRAINT "FK_doctors_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "directions" ADD CONSTRAINT "FK_directions_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "certificate_types" ADD CONSTRAINT "FK_ct_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_roles_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_history_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT IF EXISTS "FK_history_tenant"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT IF EXISTS "FK_roles_tenant"`);
    await queryRunner.query(`ALTER TABLE "certificate_types" DROP CONSTRAINT IF EXISTS "FK_ct_tenant"`);
    await queryRunner.query(`ALTER TABLE "directions" DROP CONSTRAINT IF EXISTS "FK_directions_tenant"`);
    await queryRunner.query(`ALTER TABLE "doctors" DROP CONSTRAINT IF EXISTS "FK_doctors_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants"`);
  }
}


