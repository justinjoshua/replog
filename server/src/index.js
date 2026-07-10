import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { seedExercises } from "./seed.js";

import exercisesRouter from "./routes/exercises.js";
import workoutsRouter from "./routes/workouts.js";
import statsRouter from "./routes/stats.js";
import aiRouter from "./routes/ai.js";

const PORT = process.env.PORT || 4000;

async function main() {
  const { stop } = await connectDB();
  await seedExercises(); // idempotent: only inserts the starter library once

  // Flush the local DB cleanly on exit so data is durable and the next start
  // doesn't hit a stale lock. (No-op-ish for a remote MONGO_URI.)
  let closing = false;
  const shutdown = async (signal) => {
    if (closing) return;
    closing = true;
    console.log(`\n[server] ${signal} received — closing DB…`);
    try {
      await stop?.();
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/exercises", exercisesRouter);
  app.use("/api/workouts", workoutsRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/ai", aiRouter);

  // Central error handler
  app.use((err, req, res, next) => {
    console.error("[error]", err);
    res.status(500).json({ error: err.message || "Server error" });
  });

  app.listen(PORT, () =>
    console.log(`[server] API listening on http://localhost:${PORT}`)
  );
}

main().catch((e) => {
  console.error("Fatal startup error:", e);
  process.exit(1);
});
