import "dotenv/config";
import { createApp } from "./app.js";
import { connectDB } from "./db.js";
import { seedExercises } from "./seed.js";

// Vercel serverless entry. On Vercel MONGO_URI is always set, so connectDB()
// talks to Atlas (never the local disk mongo). The Express app itself is
// stateless; DB init is cached at module scope so it runs once per warm
// container instead of on every request.
const app = createApp();

let initPromise;
function ensureInit() {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await seedExercises(); // idempotent — safe to run on each cold start
    })().catch((err) => {
      initPromise = undefined; // let the next request retry a failed init
      throw err;
    });
  }
  return initPromise;
}

export default async function handler(req, res) {
  await ensureInit();
  return app(req, res);
}
