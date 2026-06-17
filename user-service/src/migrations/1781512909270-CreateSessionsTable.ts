import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateSessionsTable1781512909270 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "sessions",
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
                    },
                    {
                        name: "token_hash",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "device_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "device_name",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "last_ip",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "expires_at",
                        type: "timestamp",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "revoked_at",
                        type: "timestamp",
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FK_SESSIONS_USER_ID_USERS_ID',
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            "sessions",
            new TableIndex({
                name: "UQ_SESSIONS_USER_ID_DEVICE_ID",
                columnNames: ["user_id", "device_id"],
                isUnique: true,
            }),
        );

        await queryRunner.createIndex(
            "sessions",
            new TableIndex({
                name: "IDX_SESSIONS_TOKEN_HASH",
                columnNames: ["token_hash"],
            }),
        );

        await queryRunner.createIndex(
            "sessions",
            new TableIndex({
                name: "IDX_SESSIONS_ACTIVE_USER_ID",
                columnNames: ["user_id"],
                where: `"revoked_at" IS NULL`,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("sessions", "UQ_SESSIONS_USER_ID_DEVICE_ID");
        await queryRunner.dropIndex("sessions", "IDX_SESSIONS_TOKEN_HASH");
        await queryRunner.dropIndex("sessions", "IDX_SESSIONS_ACTIVE_USER_ID");
        await queryRunner.dropForeignKey("sessions", "FK_SESSIONS_USER_ID_USERS_ID");
        await queryRunner.dropTable("sessions");
    }
}
