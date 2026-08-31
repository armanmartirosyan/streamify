import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Permission } from "./permissions.entity";
import { Role } from "./roles.entity";

@Entity({ name: "role_permissions" })
export class RolePermission {
  @PrimaryColumn({ name: "role_id", type: "bigint", nullable: false })
  roleId!: number;

  @ManyToOne(() => Role, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id", foreignKeyConstraintName: "FK_ROLE_PERMISSIONS_ROLE_ID_ROLES_ID" })
  role!: Role;

  @PrimaryColumn({ name: "permission_id", type: "bigint", nullable: false })
  permissionId!: number;

  @ManyToOne(() => Permission, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_id", foreignKeyConstraintName: "FK_ROLE_PERMISSIONS_PERMISSION_ID_PERMISSIONS_ID" })
  permission!: Permission;

  @Column({ name: "assigned_at", type: "timestamp", default: (): string => "CURRENT_TIMESTAMP" })
  assignedAt!: Date;
}