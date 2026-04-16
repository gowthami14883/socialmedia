// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import path from "path";

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
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://192.168.191.99:5173",
    ],
    credentials: true,
  })
);

// JSON parsing
app.use(express.json());


// ---------------- Routes ----------------
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/followers", followerRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chats", chatRoutes);

// Static files (uploads)
app.use("/uploads", express.static(join(__dirname, "..", "uploads")));
export default app;