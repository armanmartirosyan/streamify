import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegistrationUserDto } from "@/auth/dto/registration.user.dto";
import { SecurityService } from "@/security/security.service";
import { User } from "./entities/user.entity";
import {
  UserAlreadyExistsException,
  PasswordsDoNotMatchException,
} from "./exceptions/index.exceptions";
import type { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly securityService: SecurityService,
  ) {}

  async createUser(data: RegistrationUserDto): Promise<User> {
    const existingUser: User | null = await this.userRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
    });
    if (existingUser) {
      const field: string = existingUser.email === data.email ? "email" : "username";

      throw new UserAlreadyExistsException(field);
    }

    if (data.password !== data.confirmPassword) throw new PasswordsDoNotMatchException();

    const password: string = await this.securityService.hashPassword(data.password);
    const user: User = this.userRepository.create({
      email: data.email,
      username: data.username,
      password: password,
      displayName: data.displayName,
      avatarUrl: null,
      verifiedAt: null,
    });
    return await this.userRepository.save(user);
  }
}
