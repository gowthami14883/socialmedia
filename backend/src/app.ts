// src/app.ts
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import path from "path";

dotenv.config();

// Import route files (make sure these export Router objects)
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import followerRoutes from "./routes/follower.routes.js";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app: Application = express();

// ---------------- Middlewares ----------------

// CORS configuration
const allowedOrigins: string[] = [
  "http://localhost:3000",
  "http://localhost:5173",
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// JSON parsing
app.use(express.json());


// ---------------- Health Check ----------------
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.VERCEL ? "vercel" : "local",
    timestamp: new Date().toISOString(),
  });
});

// ---------------- Routes ----------------
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/followers", followerRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chats", chatRoutes);

// Static files (uploads)
app.use("/uploads", express.static(join(__dirname, "..", "..", "uploads")));
export default app;