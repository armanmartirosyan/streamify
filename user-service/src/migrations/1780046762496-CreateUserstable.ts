import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUserstable1780046762496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
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
            name: "stream_key",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "verified_at",
            type: "timestamp",
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
