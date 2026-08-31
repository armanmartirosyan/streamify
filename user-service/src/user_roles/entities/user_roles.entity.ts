import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "@/users/entities/user.entity";
import { Role } from "./roles.entity";

@Entity({ name: "user_roles" })
export class UserRole {
  @PrimaryColumn({ name: "user_id", type: "bigint", nullable: false })
  userId!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", foreignKeyConstraintName: "FK_USER_ROLES_USER_ID_USERS_ID" })
  user!: User;

  @PrimaryColumn({ name: "role_id", type: "bigint", nullable: false })
  roleId!: number;

  @ManyToOne(() => Role, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id", foreignKeyConstraintName: "FK_USER_ROLES_ROLE_ID_ROLES_ID" })
  role!: Role;

  @Column({ name: "assigned_by", type: "bigint", nullable: true })
  assignedById!: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "assigned_by", foreignKeyConstraintName: "FK_USER_ROLES_ASSIGNED_BY_USERS_ID" })
  assignedBy!: User | null;

  @Column({ name: "created_at", type: "timestamp", default: (): string => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
