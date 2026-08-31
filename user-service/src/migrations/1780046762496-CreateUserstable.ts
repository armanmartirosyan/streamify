import { Table, TableIndex } from "typeorm";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserstable1780046762496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "bigint",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
            length: "255",
            isNullable: false,
          },
          {
            name: "username",
            type: "varchar",
            isUnique: true,
            length: "30",
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "display_name",
            type: "varchar",
            length: "30",
            isNullable: true,
          },
          {
            name: "avatar_url",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "verified_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_USERS_EMAIL",
        columnNames: ["email"],
      }),
    );

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_USERS_USERNAME",
        columnNames: ["username"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("users", "IDX_USERS_EMAIL");
    await queryRunner.dropIndex("users", "IDX_USERS_USERNAME");
    await queryRunner.dropTable("users");
  }
}
