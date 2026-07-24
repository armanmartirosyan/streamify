# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`user-service` is a NestJS microservice, part of a larger "Streamify" system. It is **not** an HTTP service — it exposes a gRPC API only (see `src/proto/user.proto`), served over TLS using certs in `certs/`. It owns authentication, users, sessions, roles/permissions, and stream keys.

## Commands

```bash
npm run start:dev        # run with watch mode (requires .env + certs, see below)
npm run build             # nest build -> dist/
npm run lint               # eslint --fix on src/apps/libs/test
npm run format              # prettier --write on src/ and test/

npm run test                          # unit tests (jest, rootDir: src, pattern *.spec.ts)
npm run test -- users.service.spec.ts # run a single unit test file
npm run test:watch
npm run test:cov
npm run test:e2e                      # e2e tests (test/*.e2e-spec.ts, separate jest config)

npm run migration:create --name=SomeName   # scaffolds src/migrations/<timestamp>-SomeName.ts
npm run migration:run
npm run migration:revert
```

The app will not boot without `GRPC_CA_CERT_PATH`, `GRPC_SERVER_CERT_PATH`, and `GRPC_SERVER_KEY_PATH` pointing at valid cert files (see `certs/`) — `main.ts` throws immediately if any are missing. `src/config/config.validator.ts` also requires `PSQL_URI`, `PSQL_MIGRATION_URI`, `REDIS_URI`, `LOG_LEVEL`, and `PROFILE` to be set, or `ConfigModule` fails fast on boot.

## Architecture

### Transport: gRPC, not REST

There is no HTTP controller layer. `main.ts` boots the app via `NestFactory.createMicroservice` with `Transport.GRPC`, loading `src/proto/user.proto` (copied into `dist/proto` at build time via `nest-cli.json`'s `assets` config). Controllers use `@GrpcMethod("ServiceName", "RpcName")` instead of `@Get`/`@Post` decorators. When adding an RPC, it must be declared in `user.proto` first, then implemented as a `@GrpcMethod` handler — the two must stay in sync manually (no codegen step currently wired in).

Proto-loader options in `main.ts` matter for typing: `longs: String` (int64 fields arrive as strings), `enums: String` (enums arrive as their string name), `keepCase: true` (proto field names are NOT camelCased), `defaults`/`arrays`/`objects: true` (missing fields are backfilled rather than `undefined`).

Validation errors are translated into `RpcException` (not HTTP exceptions) by the global `ValidationPipe`'s `exceptionFactory` in `main.ts` — gRPC clients receive `INVALID_ARGUMENT` status with a JSON-stringified array of messages.

### Two DataSource configs, one shared base

`src/database/data-source.base.ts` holds the common TypeORM options (`schema: "user_service"`, entity/migration globs). Two DataSources extend it:
- `data-source.app.ts` (`appDataSource`) — used by `AppModule` at runtime, reads `PSQL_URI`.
- `data-source.migrator.ts` (`migratorDataSource`) — used only by the `typeorm`/`migration:*` npm scripts, reads `PSQL_MIGRATION_URI` (a separate, presumably higher-privileged, DB connection for running migrations).

All tables live under the `user_service` Postgres schema, not `public`.

### Module layout follows the docs, but most modules are stubs

`docs/Project Struct.md` describes the intended module breakdown (Auth, Users, Sessions, Roles, UserRoles, Permissions, StreamKeys, Mail) and the intended call chains for register/login. Read it before adding to a module — it defines each service's expected responsibilities and dependencies. As of now, only `AuthModule`, `UsersModule`, `RedisModule`, `JwtModule`, `SessionsModule`, `MailModule`, and `UserRolesModule` exist as files, and most are empty `@Injectable()`/`@Module()` shells (e.g. `JwtService`, `SessionsService`, `MailService`, `UserRolesService` have no implementation yet). `AuthService.registerUser` currently returns hardcoded dummy tokens instead of calling `JwtService`. Roles/Permissions/StreamKeys modules described in the docs don't exist yet as NestJS modules, even though their tables already have migrations (`CreateRolesTable`, `CreatePermissionsTable`, `CreateRolePermissionsTable`, `CreateStreamKeysTable`).

Only `AuthModule` is currently wired into `AppModule`'s imports — new modules must be added there explicitly to take effect.

### Redis

`RedisModule` is `@Global()` and registered via `forRootAsync` in `AppModule`, reading `REDIS_URI` through `ConfigService`. It exposes a single `Redis` client under the `REDIS_CLIENT` injection token (`src/redis/redis.constants.ts`), injectable anywhere without re-importing the module.

### Path alias

`@/*` maps to `src/*` (`tsconfig.json`). Import ordering is enforced by ESLint (`import/order`): builtin → external → internal (`@/...`) → relative → type-only, alphabetized within each group.
