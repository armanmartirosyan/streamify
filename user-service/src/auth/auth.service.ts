import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@/jwt/jwt.service";
import { UserRolesService } from "@/user_roles/user_roles.service";
import type { User } from "@/users/entities/user.entity";
import { UsersService } from "@/users/users.service";
import { RegistrationUserDto } from "./dto/registration.user.dto";
import { RegistrationUserResponseDto } from "./dto/registration.user.response.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRolesService,
  ) {}

  async registerUser(data: RegistrationUserDto): Promise<RegistrationUserResponseDto> {
    const user: User = await this.usersService.createUser(data);
    // const userRole = await this.userRoleService.createUserRole(user, "user");
    // const tokens = await this.jwtService.generateTokens(user);

    return new RegistrationUserResponseDto({
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      accessToken: "",
      refreshToken: "",
    });
  }
}
