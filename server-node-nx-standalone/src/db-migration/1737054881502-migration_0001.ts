import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration11737054881502 implements MigrationInterface {
  name = "Migration11737054881502";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" text NOT NULL DEFAULT (''),
                "lastName" text NOT NULL DEFAULT (''),
                "age" integer NOT NULL DEFAULT (0),
                "email" text NOT NULL DEFAULT (''),
                "password" text NOT NULL DEFAULT (''),
                "role" text NOT NULL DEFAULT (''),
                "isActive" boolean NOT NULL DEFAULT (0)
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "post" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" text NOT NULL DEFAULT ('')
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "post"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
