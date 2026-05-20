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
      }
    ],
    false,
  );

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: "user",
      protoPath: join(__dirname, "proto/user.proto"),
      url: `0.0.0.0:${port}`,
    },
    logger: ["error", "warn", "log", "debug", "verbose"],
  });
  await app.listen();
  logger.log(`User service is listening on port ${port}`);
}

void bootstrap();
