import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configValidator } from "./config/config.validator";
import { appDataSource } from "./database/data-source.app";
import { RedisModule } from "./redis/redis.module";
import { UsersModule } from "./users/users.module";
import type { RedisModuleTypes as RMT } from "./redis/redis.d.ts";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: configValidator }),
    TypeOrmModule.forRoot(appDataSource.options),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService): RMT.ModuleFactory => ({
        url: configService.getOrThrow<string>("REDIS_URI"),
        db: 0,
        retryStrategy: (times: number): number => Math.min(times * 100, 3000),
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
