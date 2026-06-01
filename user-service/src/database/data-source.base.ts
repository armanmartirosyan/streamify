import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const baseDataSourceOptions: PostgresConnectionOptions = {
  type: "postgres",
  schema: "user_service",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
};
