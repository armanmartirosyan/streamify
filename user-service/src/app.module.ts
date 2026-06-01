import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { appDataSource } from "./database/data-source.app";
import { ConfigModule } from "@nestjs/config";
import { configValidator } from "./config/config.validator";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: configValidator }),
    TypeOrmModule.forRoot(appDataSource.options),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
