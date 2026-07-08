import { Exclude } from "class-transformer";
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
  @Exclude()
  password!: string;

  @Column({ name: "display_name", type: "varchar", length: 30, nullable: true })
  displayName!: string | null;

  @Column({ name: "avatar_url", type: "varchar", length: 255, nullable: true })
  avatarUrl!: string | null;

  @Column({ name: "created_at", type: "timestamp", default: (): string => "CURRENT_TIMESTAMP" })
  @Exclude()
  createdAt!: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: (): string => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  @Exclude()
  updatedAt!: Date;

  @Column({ name: "verified_at", type: "timestamp", nullable: true })
  verifiedAt!: Date | null;
}
