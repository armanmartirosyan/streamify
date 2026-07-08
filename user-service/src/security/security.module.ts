import { DynamicModule, Global, Module } from "@nestjs/common";
import { SecurityService } from "./security.service";

@Global()
@Module({
  providers: [SecurityService],
})
export class SecurityModule {
  static forRoot(): DynamicModule {
    return {
      module: SecurityModule,
      providers: [SecurityService],
      exports: [SecurityService],
    };
  }
}
