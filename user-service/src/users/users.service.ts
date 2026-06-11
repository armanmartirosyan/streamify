import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import type { Users } from "./users.d";
import type { Repository } from "typeorm";
import { RedisService } from "@/redis/redis.service";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async create(createUserDto: Users.CreateUserRequest): Promise<Users.CreateUserRequestResponse> {
    await this.redisService.set("test_key", "This is a test value from UsersService");
    this.logger.debug(`Creating user with name: ${createUserDto.name}`);
    return {
      id: Math.floor(Math.random() * 1000),
      name: createUserDto.name,
    };
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
