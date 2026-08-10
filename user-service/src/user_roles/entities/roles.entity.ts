import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "roles" })
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: false })
    description!: string;

    @Column({ name: "is_system", default: false })
    isSystem!: boolean;

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
}