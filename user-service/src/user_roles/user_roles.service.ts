import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role, UserRole } from "@/user_roles/entities/roles.entities.index";
import type { User } from "@/users/entities/user.entity";

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>
  ) {}

  async assignRole(user: User, roleName: string): Promise<void> {
    
  } 
}
