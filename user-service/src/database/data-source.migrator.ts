import "dotenv/config";
import { DataSource } from "typeorm";
import { baseDataSourceOptions } from "./data-source.base";

const databaseUrl: string | undefined = process.env.PSQL_MIGRATION_URI;
if (!databaseUrl) {
  throw new Error("PSQL_MIGRATION_URI environment variable is not set.");
}

export const migratorDataSource = new DataSource({
  ...baseDataSourceOptions,
  url: databaseUrl,
  logging: process.env.PROFILE === "development",
  synchronize: false,
});
