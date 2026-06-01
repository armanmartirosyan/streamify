import "dotenv/config";
import fs from "node:fs";
import { join } from "node:path";
import * as grpc from "@grpc/grpc-js";
import { INestMicroservice, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import type { ServerCredentials } from "@grpc/grpc-js";

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger("Main");
  const configService: ConfigService = new ConfigService();
  const port: number = configService.get<number>("PORT") || 9007;
  const caCertPath: string | undefined = configService.get<string>("GRPC_CA_CERT_PATH");
  const serverCertPath: string | undefined = configService.get<string>("GRPC_SERVER_CERT_PATH");
  const serverKeyPath: string | undefined = configService.get<string>("GRPC_SERVER_KEY_PATH");
  const logLevel: string = configService.get<string>("LOG_LEVEL") || "log,warn,error,debug,verbose";

  if (!caCertPath || !serverCertPath || !serverKeyPath) {
    logger.error("GRPC certificate paths are not properly configured in environment variables.");
    throw new Error("Missing GRPC certificate paths in environment variables.");
  }

  const credentials: ServerCredentials = grpc.ServerCredentials.createSsl(
    fs.readFileSync(caCertPath),
    [
      {
        cert_chain: fs.readFileSync(serverCertPath),
        private_key: fs.readFileSync(serverKeyPath),
      },
    ],
    false,
  );

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: "user",
      protoPath: join(__dirname, "proto/user.proto"),
      url: `0.0.0.0:${port}`,
      credentials,
      loader: {
        keepCase: true, // keeps field names as-is from .proto (e.g. user_id stays user_id, not userId)
        longs: String, // proto3 int64/uint64 → JS string (avoids precision loss; JS can't safely handle 64-bit ints natively)
        enums: String, // proto3 enums → string name instead of number (e.g. "ACTIVE" not 0)
        defaults: true, // missing fields in response get their default values (0, "", false) instead of undefined
        oneofs: true, // oneof fields are represented as a single virtual field holding the active field's name
        arrays: true, // ensures repeated fields always come back as arrays even when empty (never undefined)
        objects: true, // ensures message fields always come back as objects even when empty (never undefined/null)
        includeDirs: [join(__dirname, "proto")], // base dirs for resolving imports inside .proto files (e.g. import "common.proto")
      },
    },
    logger: logLevel.split(",") as ("verbose" | "debug" | "log" | "warn" | "error" | "fatal")[],
  });
  await app.listen();
  logger.log(`User service is listening on port ${port}`);
}

void bootstrap();
