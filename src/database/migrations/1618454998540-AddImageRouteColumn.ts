import {MigrationInterface, QueryRunner} from "typeorm";

export class AddImageRouteColumn1618454998540 implements MigrationInterface {
    name = 'AddImageRouteColumn1618454998540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('POWER_USER', 'MANAGER', 'USER', 'WATCHMAN')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "vaultName" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "pin" integer, "role" "user_role_enum" NOT NULL DEFAULT 'POWER_USER', "imageRoute" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "appointment_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "status" "appointment_status_enum" NOT NULL DEFAULT 'PENDING', "userId" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TYPE "appointment_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }

}
