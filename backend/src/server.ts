// src/server.ts
import dotenv from "dotenv";
import app from "./app.js";
import db from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Do NOT alter tables if you don't want to drop data
    // Just authenticate the database connection
    await db.sequelize.authenticate();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

startServer();