// src/models/index.ts
import sequelize from "../config/database.js";

import User from "./user.model.js";
import Post from "./post.model.js";
import Comment from "./comment.model.js";
import Like from "./like.model.js";
import Follower from "./follower.model.js";
import Chat from "./chat.model.js";

// ---------------- Associations ----------------
User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "user_id" });

Post.hasMany(Comment, { foreignKey: "post_id", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "post_id" });

User.hasMany(Like, { foreignKey: "user_id", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "user_id" });

Post.hasMany(Like, { foreignKey: "post_id", onDelete: "CASCADE" });
Like.belongsTo(Post, { foreignKey: "post_id" });

User.hasMany(Follower, { foreignKey: "follower_user_id", as: "Following", onDelete: "CASCADE" });
User.hasMany(Follower, { foreignKey: "following_user_id", as: "Followers", onDelete: "CASCADE" });

Follower.belongsTo(User, { foreignKey: "follower_user_id", as: "FollowerUser" });
Follower.belongsTo(User, { foreignKey: "following_user_id", as: "FollowingUser" });

User.hasMany(Chat, { foreignKey: "sender_id", as: "SentMessages", onDelete: "CASCADE" });
User.hasMany(Chat, { foreignKey: "receiver_id", as: "ReceivedMessages", onDelete: "CASCADE" });

Chat.belongsTo(User, { foreignKey: "sender_id", as: "Sender" });
Chat.belongsTo(User, { foreignKey: "receiver_id", as: "Receiver" });

// ---------------- Export db ----------------
export const db = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  Follower,
  Chat,
};

export default db;