import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Like = sequelize.define("Like", {
  like_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, {
  tableName: "likes",
  timestamps: true
});

export default Like;