import {MigrationInterface, QueryRunner} from "typeorm";

export class AddVaultColumn1614907308095 implements MigrationInterface {
    name = 'AddVaultColumn1614907308095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "vaultName" character varying DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "vaultName"`);
    }

}
