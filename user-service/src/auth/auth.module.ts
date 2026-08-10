import { Module } from "@nestjs/common";
import { JwtModule } from "@/jwt/jwt.module";
import { UserRolesModule } from "@/user_roles/user_roles.module";
import { UsersModule } from "@/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UsersModule, JwtModule, UserRolesModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
