import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUserRolesTable1781600390991 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user_roles",
                columns: [
                    {
                        name: "user_id",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "role_id",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "assigned_by",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "assigned_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
                uniques: [
                    {
                        name: "UQ_USER_ROLES_USER_ID_ROLE_ID",
                        columnNames: ["user_id", "role_id"],
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_roles");
    }
}