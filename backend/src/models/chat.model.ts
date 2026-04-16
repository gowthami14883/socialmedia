import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Chat = sequelize.define("Chat", {
  chat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "chats",
  timestamps: true
});

export default Chat;