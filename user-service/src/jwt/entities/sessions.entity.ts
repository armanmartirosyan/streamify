import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "sessions" })
export class Sessions {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "bigint", nullable: false })
  userId!: number;

  @Column({ name: "token_hash", type: "varchar", length: 255, nullable: false })
  tokenHash!: string;

  @Column({ name: "device_id", type: "uuid", nullable: false })
  deviceId!: string;

  @Column({ name: "device_name", type: "varchar", length: 255, nullable: true })
  deviceName?: string;

  @Column({ name: "last_ip", type: "varchar", length: 255, nullable: true })
  lastIp?: string;

  @Column({ name: "expires_at", type: "timestamp", nullable: false })
  expiresAt!: Date;

  @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revokedAt?: Date;
}
