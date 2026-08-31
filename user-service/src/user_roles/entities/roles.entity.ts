import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { RolePermission } from "./role_permissions.entity";
import { UserRole } from "./user_roles.entity";

@Entity({ name: "roles" })
export class Role {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  description!: string;

  @Column({ name: "is_system", default: false })
  isSystem!: boolean;

  @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles!: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions!: RolePermission[];
}
