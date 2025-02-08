import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration21737055481500 implements MigrationInterface {
  name = "Migration21737055481500";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "temporary_post" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" text NOT NULL DEFAULT (''),
                "content" text NOT NULL DEFAULT (''),
                "author" text NOT NULL DEFAULT ('')
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_post"("id", "title")
            SELECT "id",
                "title"
            FROM "post"
        `);
    await queryRunner.query(`
            DROP TABLE "post"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_post"
                RENAME TO "post"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "post"
                RENAME TO "temporary_post"
        `);
    await queryRunner.query(`
            CREATE TABLE "post" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" text NOT NULL DEFAULT ('')
            )
        `);
    await queryRunner.query(`
            INSERT INTO "post"("id", "title")
            SELECT "id",
                "title"
            FROM "temporary_post"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_post"
        `);
  }
}
