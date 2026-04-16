import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        connectTimeout: 60000,
      },
    })
  : new Sequelize(
      process.env.DB_NAME as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
      }
    );

export default sequelize;