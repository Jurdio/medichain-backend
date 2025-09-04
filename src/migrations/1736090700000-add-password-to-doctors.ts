import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToDoctors1736090700000 implements MigrationInterface {
  name = 'AddPasswordToDoctors1736090700000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "passwordHash" varchar(120)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "doctors" DROP COLUMN IF EXISTS "passwordHash"`);
  }
}



