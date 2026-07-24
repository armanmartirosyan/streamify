import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@/jwt/jwt.service";
import { UserRolesService } from "@/user_roles/user_roles.service";
import { UsersService } from "@/users/users.service";
import { RegistrationUserDto } from "./dto/registration.user.dto";
import type { AuthTypes } from "./auth.types";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRolesService,
  ) { }

  async registerUser(data: RegistrationUserDto): Promise<AuthTypes.RegisterUserResponse> {
    const user = await this.usersService.createUser(data);
    // const tokens = await this.jwtService.generateTokens(user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      verifiedAt: user.verifiedAt,
      accessToken: "",
      refreshToken: "",
    };
  }
}
