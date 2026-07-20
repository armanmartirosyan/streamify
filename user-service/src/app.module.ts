import { Module, ClassSerializerInterceptor, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { globalFilters } from "./common/filters";
import { configValidator } from "./config/config.validator";
import { appDataSource } from "./database/data-source.app";
import { RedisModule } from "./redis/redis.module";
import { SecurityModule } from "./security/security.module";
import type { RedisModuleTypes as RMT } from "./redis/redis.d.ts";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: configValidator }),
    TypeOrmModule.forRoot(appDataSource.options),
    SecurityModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService): RMT.ModuleFactory => ({
        url: configService.getOrThrow<string>("REDIS_URI"),
        db: 0,
        retryStrategy: (times: number): number => Math.min(times * 100, 3000),
      }),
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    ...globalFilters.map(
      (filter): Provider => ({
        provide: APP_FILTER,
        useClass: filter,
      }),
    ),
  ],
})
export class AppModule {}
