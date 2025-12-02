import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1764624234436 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(255) NOT NULL,
            "email" character varying(255) NOT NULL UNIQUE,
            "password" character varying NOT NULL,
            "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
