import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { RegistrationUserDto } from "./dto/registration.user.dto";
import type { AuthTypes as AT } from "./auth.types";
import type { UsersService } from "@/users/users.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod("AuthService", "RegisterUser")
  async registerUser(data: RegistrationUserDto): Promise<AT.RegisterUserResponse> {
    // console.log(123);
    const user: AT.RegisterUserResponse = await this.authService.registerUser(data);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      tokens: user.tokens,
    };
  }
}
