import type { ConfigService } from "@nestjs/config";

export namespace RedisModuleTypes {
  type ModuleOptions = {
    imports?: any[];
    inject?: any[];
    useFactory: (...args: any[]) => ModuleFactory;
  };

  type ModuleFactory = {
    url: string;
    db?: number;
    retryStrategy?: (times: number) => number;
  };

  type RedisFactoryDeps = [ConfigService];
}
