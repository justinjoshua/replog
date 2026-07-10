import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Connect to MongoDB.
 *
 * Priority:
 *   1. MONGO_URI (e.g. a MongoDB Atlas connection string) — used for deployment
 *      and if you want a cloud database.
 *   2. Otherwise run a REAL local mongod that stores its data on disk under
 *      `server/.data/mongodb`, so your workouts persist across restarts with
 *      zero setup and no account. (The mongod binary is fetched/cached once by
 *      mongodb-memory-server.)
 *
 * Returns `{ stop }` so the app can shut the local server down cleanly.
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (uri) {
    await mongoose.connect(uri);
    console.log("[db] connected to MongoDB via MONGO_URI");
    return { persisted: true, stop: () => mongoose.disconnect() };
  }

  const dbPath = path.resolve(__dirname, "../.data/mongodb");
  fs.mkdirSync(dbPath, { recursive: true });

  const { MongoMemoryServer } = await import("mongodb-memory-server");
  // dbPath + wiredTiger => data is written to disk and reused on next start.
  // No fixed port (avoids clashes); persistence comes from dbPath, not the port.
  const mem = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: "wiredTiger", dbName: "replog" },
  });
  await mongoose.connect(mem.getUri("replog"));
  console.log(`[db] connected to local persistent MongoDB — data at ${dbPath}`);

  const stop = async () => {
    try {
      await mongoose.disconnect();
      await mem.stop({ doCleanup: false }); // keep the on-disk data
    } catch {
      /* already shutting down */
    }
  };
  return { persisted: true, stop };
}
