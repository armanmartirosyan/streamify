function configValidator(config: Record<string, unknown>): Record<string, unknown> {
  const required: string[] = [
    "PSQL_URI",
    "PSQL_MIGRATION_URI",
    "GRPC_CA_CERT_PATH",
    "GRPC_SERVER_CERT_PATH",
    "GRPC_SERVER_KEY_PATH",
  ];

  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Environment variable ${key} is required`);
    }
  }

  if (config.PORT !== undefined && Number.isNaN(Number(config.PORT))) {
    throw new Error("PORT must be a number");
  }

  return {
    ...config,
    PORT: config.PORT !== undefined ? Number(config.PORT) : undefined,
  } as Record<string, unknown>;
}

export { configValidator };
