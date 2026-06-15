import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ unique: true, length: 255, nullable: false })
  email!: string;

  @Column({ unique: true, length: 30, nullable: false })
  username!: string;

  @Column({ length: 255, nullable: false })
  password!: string;

  @Column({ name: "display_name", length: 30, nullable: true })
  displayName?: string;

  @Column({ name: "avatar_url", length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ name: "created_at", type: "timestamp", default: (): string => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ name: "updated_at", type: "timestamp", default: (): string => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  @Column({ name: "verified_at", type: "timestamp", nullable: true })
  verifiedAt?: Date;

}
