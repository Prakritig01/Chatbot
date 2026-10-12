export type NodeEnv = "development" | "test" | "production";

export interface AppConfig {
  readonly nodeEnv: NodeEnv;
  readonly port: number;
}

const DEFAULT_PORT = 3000;

export function parseNodeEnv(raw: string | undefined): NodeEnv {
  const value = raw ?? "development";
  if (value === "development" || value === "test" || value === "production") {
    return value;
  }
  throw new Error(
    `Invalid NODE_ENV: expected development | test | production, got "${raw}"`,
  );
}

export function parsePort(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === "") {
    return DEFAULT_PORT;
  }
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`Invalid PORT: expected integer 1-65535, got "${raw}"`);
  }
  return parsed;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    nodeEnv: parseNodeEnv(env.NODE_ENV),
    port: parsePort(env.PORT),
  };
}

export const config: AppConfig = loadConfig();
