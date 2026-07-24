import { Injectable } from "@nestjs/common";
import { User } from "@/users/entities/user.entity";
import { JwtTypes } from "./jwt.types";

@Injectable()
export class JwtService {
  constructor() {}
}
