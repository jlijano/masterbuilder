import { Controller, Get } from "@nestjs/common";

interface HealthResponse {
  service: string;
  status: "ok";
  timestamp: string;
  version: string;
}

@Controller()
export class HealthController {
  @Get("health")
  getHealth(): HealthResponse {
    return {
      service: "house-designer-api",
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env["npm_package_version"] ?? "0.1.0"
    };
  }
}
