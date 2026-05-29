import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const DEFAULT_PORT = 4000;

function getPort(): number {
  const configuredPort = process.env["PORT"] ?? process.env["API_PORT"];

  if (!configuredPort) {
    return DEFAULT_PORT;
  }

  const parsedPort = Number.parseInt(configuredPort, 10);
  return Number.isNaN(parsedPort) ? DEFAULT_PORT : parsedPort;
}

function getAllowedOrigins(): string[] {
  return (process.env["CORS_ORIGIN"] ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: getAllowedOrigins()
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      whitelist: true
    })
  );

  await app.listen(getPort());
}

void bootstrap();
