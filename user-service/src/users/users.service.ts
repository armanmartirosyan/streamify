import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegistrationUserDto } from "@/auth/dto/registration.user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: RegistrationUserDto): Promise<User> {
    const user = this.userRepository.create({
      email: data.email,
      username: data.username,
      password: data.password,
      displayName: data.displayName,
    });
    return await this.userRepository.save(user);
  }
}
