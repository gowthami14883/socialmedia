import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Post extends Model {}

Post.init(
  {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    caption: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ optional
    },

    media_url: {
      type: DataTypes.JSON,
      allowNull: true, // ✅ optional
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "posts",
    timestamps: true,
  }
);

export default Post;