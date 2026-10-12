import { Router } from "express";

export const healthRouter: Router = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api",
    nodeEnv: process.env.NODE_ENV ?? "development",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
