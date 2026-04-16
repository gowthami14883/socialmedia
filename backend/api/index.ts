import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import db from "../src/models/index.js";

// Authenticate DB once on cold start
let dbReady = false;
const initDb = async () => {
  if (!dbReady) {
    await db.sequelize.authenticate();
    dbReady = true;
  }
};

export default async function handler(req: any, res: any) {
  await initDb();
  return app(req, res);
}
