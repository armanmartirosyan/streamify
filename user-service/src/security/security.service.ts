import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class SecurityService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
