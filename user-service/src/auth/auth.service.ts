import { Injectable } from "@nestjs/common";
import { UsersService } from "@/users/users.service";
import { RegistrationUserDto } from "./dto/registration.user.dto";
import type { AuthTypes } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async registerUser(data: RegistrationUserDto): Promise<AuthTypes.RegisterUserResponse> {
    const user = await this.usersService.createUser(data);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      tokens: {
        accessToken: "dummy-access-token",
        refreshToken: "dummy-refresh-token",
      },
    };
  }
}
