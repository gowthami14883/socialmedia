// src/server.ts
import dotenv from "dotenv";
import app from "./app.js";
import db from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const isVercel = !!process.env.VERCEL;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();

    console.log("\n=== Server Configuration ===");
    console.log(`Mode:     ${isVercel ? "Vercel (Production)" : "Local (Development)"}`);
    console.log(`Port:     ${PORT}`);
    console.log(`Database: ${process.env.DATABASE_URL ? "Remote MySQL (DATABASE_URL)" : `${process.env.DB_HOST}/${process.env.DB_NAME}`}`);
    console.log(`CORS:     ${process.env.FRONTEND_URL || "localhost only"}`);
    console.log("Database connected");
    console.log("============================\n");

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

startServer();