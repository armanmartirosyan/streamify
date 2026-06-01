import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: false })
  isActive: boolean = false;
}
