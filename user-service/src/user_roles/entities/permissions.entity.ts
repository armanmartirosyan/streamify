import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { RolePermission } from "./role_permissions.entity";

@Entity({ name: "permissions" })
export class Permission {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: number;

  @Column({ name: "name", unique: true, nullable: false })
  name!: string;

  @Column({ name: "description", type: "text", nullable: false })
  description!: string;

  @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions!: RolePermission[];
}