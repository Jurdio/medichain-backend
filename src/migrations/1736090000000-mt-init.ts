import { MigrationInterface, QueryRunner } from "typeorm";

export class MtInit1736090000000 implements MigrationInterface {
  name = 'MtInit1736090000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add tenantId columns
    await queryRunner.query(`ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "tenantId" uuid`);
    await queryRunner.query(`ALTER TABLE "directions" ADD COLUMN IF NOT EXISTS "tenantId" uuid`);
    await queryRunner.query(`ALTER TABLE "certificate_types" ADD COLUMN IF NOT EXISTS "tenantId" uuid`);
    await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "tenantId" uuid`);
    await queryRunner.query(`ALTER TABLE "history" ADD COLUMN IF NOT EXISTS "tenantId" uuid`);

    // Backfill existing rows with a default tenant if needed
    await queryRunner.query(`UPDATE "roles" SET "tenantId" = COALESCE("tenantId", gen_random_uuid()) WHERE "tenantId" IS NULL`);
    // Use roles' tenant as source for doctors if possible (assumes roleId links within same tenant); fallback to random
    await queryRunner.query(`UPDATE "doctors" d SET "tenantId" = COALESCE(d."tenantId", r."tenantId") FROM "roles" r WHERE d."roleId" = r."id" AND d."tenantId" IS NULL`);
    await queryRunner.query(`UPDATE "doctors" SET "tenantId" = COALESCE("tenantId", gen_random_uuid()) WHERE "tenantId" IS NULL`);
    await queryRunner.query(`UPDATE "directions" SET "tenantId" = COALESCE("tenantId", gen_random_uuid()) WHERE "tenantId" IS NULL`);
    await queryRunner.query(`UPDATE "certificate_types" SET "tenantId" = COALESCE("tenantId", gen_random_uuid()) WHERE "tenantId" IS NULL`);
    await queryRunner.query(`UPDATE "history" SET "tenantId" = COALESCE("tenantId", gen_random_uuid()) WHERE "tenantId" IS NULL`);

    // Set NOT NULL
    await queryRunner.query(`ALTER TABLE "doctors" ALTER COLUMN "tenantId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "directions" ALTER COLUMN "tenantId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "certificate_types" ALTER COLUMN "tenantId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "tenantId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "tenantId" SET NOT NULL`);

    // Drop old unique constraints if exist and add composite uniques
    // Doctors
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_doctors_email_unique"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_doctors_wallet_unique"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_doctors_tenant_email" ON "doctors" ("tenantId", "email")`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_doctors_tenant_wallet" ON "doctors" ("tenantId", "walletAddress")`);

    // Directions
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_directions_name_unique"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_directions_slug_unique"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_directions_tenant_name" ON "directions" ("tenantId", "name")`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_directions_tenant_slug" ON "directions" ("tenantId", "slug")`);

    // Certificate types
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_certificate_types_name_unique"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_certificate_types_slug_unique"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_ct_tenant_name" ON "certificate_types" ("tenantId", "name")`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_ct_tenant_slug" ON "certificate_types" ("tenantId", "slug")`);

    // Roles
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_name_unique"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_slug_unique"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_roles_tenant_name" ON "roles" ("tenantId", "name")`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_roles_tenant_slug" ON "roles" ("tenantId", "slug")`);

    // Useful additional indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_doctors_tenant" ON "doctors" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_directions_tenant" ON "directions" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_certificate_types_tenant" ON "certificate_types" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_roles_tenant" ON "roles" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_history_tenant" ON "history" ("tenantId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_history_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_roles_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_certificate_types_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_directions_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_doctors_tenant"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_roles_tenant_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_roles_tenant_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_ct_tenant_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_ct_tenant_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_directions_tenant_slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_directions_tenant_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_doctors_tenant_wallet"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_doctors_tenant_email"`);

    await queryRunner.query(`ALTER TABLE "history" DROP COLUMN IF EXISTS "tenantId"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN IF EXISTS "tenantId"`);
    await queryRunner.query(`ALTER TABLE "certificate_types" DROP COLUMN IF EXISTS "tenantId"`);
    await queryRunner.query(`ALTER TABLE "directions" DROP COLUMN IF EXISTS "tenantId"`);
    await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN IF EXISTS "tenantId"`);
  }
}


