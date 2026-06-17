import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateRolePermissionsTable1781685522315 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "role_permissions",
                columns: [
                    {
                        name: "role_id",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "permission_id",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
                uniques: [
                    {
                        name: "UQ_ROLE_PERMISSIONS_ROLE_ID_PERMISSION_ID",
                        columnNames: ["role_id", "permission_id"],
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("role_permissions");
    }

}
