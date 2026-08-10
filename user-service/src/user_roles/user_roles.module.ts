import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/roles.entity";
import { UserRolesService } from "./user_roles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
