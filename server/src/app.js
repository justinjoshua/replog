import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.js";
import exercisesRouter from "./routes/exercises.js";
import workoutsRouter from "./routes/workouts.js";
import statsRouter from "./routes/stats.js";
import aiRouter from "./routes/ai.js";

/**
 * Build the Express app (routes + middleware) with no server binding and no DB
 * connection. Shared by the local dev entry (`index.js`, which calls listen())
 * and the Vercel serverless entry (`serverless.js`, which exports it as a
 * function handler). Keeping construction here means both run identical routes.
 */
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);
  app.use("/api/exercises", exercisesRouter);
  app.use("/api/workouts", workoutsRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/ai", aiRouter);

  // Central error handler
  app.use((err, req, res, next) => {
    console.error("[error]", err);
    res.status(500).json({ error: err.message || "Server error" });
  });

  return app;
}
