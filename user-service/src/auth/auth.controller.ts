import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { RegistrationUserDto } from "./dto/registration.user.dto";
import type { AuthTypes as AT } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod("AuthService", "RegisterUser")
  async registerUser(data: RegistrationUserDto): Promise<AT.RegisterUserResponse> {
    return this.authService.registerUser(data);
  }
}
