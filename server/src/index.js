import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./db.js";
import { seedExercises } from "./seed.js";

const PORT = process.env.PORT || 4000;

// Local dev / self-hosted entry: connect the DB, seed the library once, then
// bind a long-running HTTP server. (Vercel uses serverless.js instead.)
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

  const app = createApp();
  app.listen(PORT, () =>
    console.log(`[server] API listening on http://localhost:${PORT}`)
  );
}

main().catch((e) => {
  console.error("Fatal startup error:", e);
  process.exit(1);
});
