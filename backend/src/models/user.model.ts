import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class User extends Model {
  public user_id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public bio!: string;
  public profilepic!: string;
  public dateofbirth!: Date;
  public gender!: "male" | "female" | "other";

}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING
    },

    bio: {
      type: DataTypes.STRING
    },

    profilepic: {
      type: DataTypes.STRING
    },

    dateofbirth: {
      type: DataTypes.DATE
    },

    gender: {
      type: DataTypes.ENUM("male", "female", "other")
    }
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true
  }
);

export default User;