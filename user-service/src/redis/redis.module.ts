import { DynamicModule, Global, Module, Logger } from "@nestjs/common";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";
import { RedisService } from "./redis.service";
import type { RedisModuleTypes as RMT } from "./redis.d.ts";

@Global()
@Module({
  providers: [RedisService],
})
export class RedisModule {
  static forRootAsync(options: RMT.ModuleOptions): DynamicModule {
    const logger = new Logger(RedisModule.name);
    const redisProvider = {
      provide: REDIS_CLIENT,

      useFactory: (...args: RMT.RedisFactoryDeps): Redis => {
        const config: RMT.ModuleFactory = options.useFactory(...args);

        const client = new Redis(config.url, {
          db: config.db,
          retryStrategy: config.retryStrategy,
        });

        client.on("error", (err: Error): void => logger.error("Redis Client Error", err));
        client.on("connect", (): void => logger.log("Connected to Redis"));
        client.on("close", (): void => logger.log("Disconnected from Redis"));

        return client;
      },
      inject: options.inject ?? [],
    };

    return {
      module: RedisModule,
      imports: options.imports,
      providers: [redisProvider, RedisService],
      exports: [RedisService],
    };
  }
}
