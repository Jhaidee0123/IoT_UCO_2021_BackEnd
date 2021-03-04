import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1601347089135 implements MigrationInterface {
  name = 'AddUserRole1601347089135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" "user_role_enum" NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" "user_role_enum" NOT NULL DEFAULT '1'`,
    );
  }
}
