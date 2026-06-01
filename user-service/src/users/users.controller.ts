import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import type { Users } from "./users.d";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod("UserService", "CreateUser")
  async create(createUserDto: Users.CreateUserRequest): Promise<Users.CreateUserRequestResponse> {
    return await this.usersService.create(createUserDto);
  }

  // @MessagePattern('findAllUsers')
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @MessagePattern('findOneUser')
  // findOne(@Payload() id: number) {
  //   return this.usersService.findOne(id);
  // }

  // @MessagePattern('updateUser')
  // update(@Payload() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(updateUserDto.id, updateUserDto);
  // }

  // @MessagePattern('removeUser')
  // remove(@Payload() id: number) {
  //   return this.usersService.remove(id);
  // }
}
