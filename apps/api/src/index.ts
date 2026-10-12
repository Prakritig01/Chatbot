import { config } from "@aikb/config";

import { createApp } from "./app.js";

const SERVICE_NAME = "api";
const app = createApp();

const server = app.listen(config.port, () => {
  console.log(
    `[${SERVICE_NAME}] listening on http://localhost:${config.port} (${config.nodeEnv})`,
  );
});

function shutdown(signal: string): void {
  console.log(`[${SERVICE_NAME}] received ${signal}, shutting down`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
