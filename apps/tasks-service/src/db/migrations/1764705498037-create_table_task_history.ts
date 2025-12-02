import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTaskHistory1764705498037 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "task_history" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "user_id" uuid NOT NULL,
          "action" character varying NOT NULL,
          "changes" jsonb NOT NULL,
          "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PK_task_history_id" PRIMARY KEY ("id"),
          CONSTRAINT "FK_task_history_user_id" FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "task_history";`);
  }
}
