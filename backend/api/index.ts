import dotenv from "dotenv";
dotenv.config();

// Force bundler to include mysql2 (Sequelize loads it dynamically)
import "mysql2";

import app from "../src/app.js";
import db from "../src/models/index.js";
import type { IncomingMessage, ServerResponse } from "http";

// Authenticate DB once on cold start
let dbReady = false;
const initDb = async () => {
  if (!dbReady) {
    await db.sequelize.authenticate();
    console.log("Database connected (Vercel serverless)");
    dbReady = true;
  }
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await initDb();
  } catch (err) {
    console.error("DB connection error:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Database connection failed" }));
    return;
  }
  return app(req as any, res as any);
}
