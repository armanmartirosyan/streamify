import { MigrationInterface, QueryRunner, Table } from "typeorm";

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
            isNullable: true,
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
        foreignKeys: [
          {
            name: "FK_USER_ROLES_USER_ID_USERS_ID",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            name: "FK_USER_ROLES_ROLE_ID_ROLES_ID",
            columnNames: ["role_id"],
            referencedTableName: "roles",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            name: "FK_USER_ROLES_ASSIGNED_BY_USERS_ID",
            columnNames: ["assigned_by"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("user_roles", "FK_USER_ROLES_USER_ID_USERS_ID");
    await queryRunner.dropForeignKey("user_roles", "FK_USER_ROLES_ROLE_ID_ROLES_ID");
    await queryRunner.dropForeignKey("user_roles", "FK_USER_ROLES_ASSIGNED_BY_USERS_ID");
    await queryRunner.dropTable("user_roles");
  }
}
