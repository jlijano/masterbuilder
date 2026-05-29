import { Controller, Get } from "@nestjs/common";

interface HealthResponse {
  service: string;
  status: "ok";
  timestamp: string;
  version: string;
}

interface ApiRootResponse extends HealthResponse {
  endpoints: {
    health: string;
  };
}

@Controller()
export class HealthController {
  @Get()
  getRoot(): ApiRootResponse {
    return {
      ...this.getHealth(),
      endpoints: {
        health: "/health"
      }
    };
  }

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
