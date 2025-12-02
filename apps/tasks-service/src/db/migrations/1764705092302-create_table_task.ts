import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTask1764705092302 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TYPE task_status_enum AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');
      CREATE TYPE task_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
    `);

    await queryRunner.query(`
      CREATE TABLE "tasks" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "title" character varying NOT NULL,
          "description" text,
          "status" task_status_enum NOT NULL DEFAULT 'TODO',
          "priority" task_priority_enum NOT NULL DEFAULT 'MEDIUM',
          "due_date" timestamp with time zone NOT NULL,
          "assigned_user_ids" uuid[] NOT NULL DEFAULT '{}'::uuid[],
          "author_id" uuid NOT NULL,
          "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"),
          CONSTRAINT "FK_tasks_author_id" FOREIGN KEY ("author_id") 
            REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks";`);
    await queryRunner.query(`DROP TYPE IF EXISTS task_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS task_priority_enum;`);
  }
}
