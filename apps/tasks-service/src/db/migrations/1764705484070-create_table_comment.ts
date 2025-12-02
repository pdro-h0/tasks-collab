import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableComment1764705484070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "comments" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "content" text NOT NULL,
          "task_id" uuid NOT NULL,
          "user_id" uuid NOT NULL,
          "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PK_8c6c318004cbf639c0546c5fc9c" PRIMARY KEY ("id"),
          CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("task_id") 
            REFERENCES "tasks"("id") ON DELETE CASCADE,
          CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "comments";`);
  }
}
