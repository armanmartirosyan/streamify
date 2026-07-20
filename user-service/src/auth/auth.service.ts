import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@/jwt/jwt.service";
import { UsersService } from "@/users/users.service";
import { RegistrationUserDto } from "./dto/registration.user.dto";
import type { AuthTypes } from "./auth.types";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(data: RegistrationUserDto): Promise<AuthTypes.RegisterUserResponse> {
    const user = await this.usersService.createUser(data);
    // const tokens = await this.jwtService.generateTokens(user);
    const tokens: AuthTypes.Tokens = {
      accessToken: "dummy-access-token",
      refreshToken: "dummy-refresh-token",
    };

    return Object.assign(user, tokens);
  }
}
