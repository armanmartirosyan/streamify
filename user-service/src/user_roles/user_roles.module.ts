import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role, UserRole } from "./entities/roles.entities.index";
import { UserRolesService } from "./user_roles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
