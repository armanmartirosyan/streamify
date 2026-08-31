import { Role } from "@/user_roles/entities/roles.entity";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class UserRolesPopulate1786356828425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = queryRunner.manager.getRepository(Role);
    await roleRepository.insert([
      { name: "USER", description: "Regular user role", isSystem: true, createdAt: new Date() },
      { name: "ADMIN", description: "Full system access", isSystem: true, createdAt: new Date() },
      {
        name: "MODERATOR",
        description: "Content and community moderation access",
        isSystem: true,
        createdAt: new Date(),
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = queryRunner.manager.getRepository(Role);
    await roleRepository.delete({ name: "USER" });
    await roleRepository.delete({ name: "ADMIN" });
    await roleRepository.delete({ name: "MODERATOR" });
  }
}
