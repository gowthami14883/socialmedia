import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Follower = sequelize.define("Follower", {
  follower_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  follower_user_id: DataTypes.INTEGER,
  following_user_id: DataTypes.INTEGER
}, {
  tableName: "followers",
  timestamps: true
});

export default Follower;