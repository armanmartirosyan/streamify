import { Injectable } from "@nestjs/common";
import { RegistrationUserDto } from "./dto/registration.user.dto";
import type { AuthTypes } from "./auth.types";
import { JwtService } from "@/jwt/jwt.service";
import { UsersService } from "@/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(data: RegistrationUserDto): Promise<AuthTypes.RegisterUserResponse> {
    const user = await this.usersService.createUser(data);
    const tokens: AuthTypes.Tokens = {
      accessToken: "dummy-access-token",
      refreshToken: "dummy-refresh-token",
    };

    return Object.assign(user, tokens);
  }
}
