import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStreamKeysTable1781701201603 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "stream_keys",
        columns: [
          {
            name: "id",
            type: "bigint",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "bigint",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "key_hash",
            type: "varchar",
            length: "255",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "last_used_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "revoked_at",
            type: "timestamp",
            isNullable: true,
            default: null,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            name: "FK_STREAM_KEYS_USER_ID_USERS_ID",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("stream_keys", "FK_STREAM_KEYS_USER_ID_USERS_ID");
    await queryRunner.dropTable("stream_keys");
  }
}
