import { MigrationInterface, QueryRunner, Table } from "typeorm";

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
            name: "assigned_at",
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
        foreignKeys: [
          {
            name: "FK_ROLE_PERMISSIONS_ROLE_ID_ROLES_ID",
            columnNames: ["role_id"],
            referencedTableName: "roles",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            name: "FK_ROLE_PERMISSIONS_PERMISSION_ID_PERMISSIONS_ID",
            columnNames: ["permission_id"],
            referencedTableName: "permissions",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("role_permissions", "FK_ROLE_PERMISSIONS_ROLE_ID_ROLES_ID");
    await queryRunner.dropForeignKey(
      "role_permissions",
      "FK_ROLE_PERMISSIONS_PERMISSION_ID_PERMISSIONS_ID",
    );
    await queryRunner.dropTable("role_permissions");
  }
}
