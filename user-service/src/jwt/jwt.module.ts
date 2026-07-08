import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sessions } from "./entities/sessions.entity";
import { JwtService } from "./jwt.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sessions])],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
