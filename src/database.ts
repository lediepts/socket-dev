import { Sequelize } from "sequelize";
import mariaDB from "mariadb";
import logger from "./accessLogs";
import "dotenv/config";

const product = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  DB_HOST:
    process.env.DB_HOST ||
    "maria-db-main-eastjp-001.privatelink.mariadb.database.azure.com",
  DB_NAME: process.env.DB_NAME || "caa",
  DB_USER_NAME:
    process.env.DB_USER_NAME || "db_adm0001@maria-db-main-eastjp-001",
  DB_PASSWORD: process.env.DB_PASSWORD || "S+)S9|%es)b!.8",
};
const develop = {
  PORT: 488,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "caa",
  DB_USER_NAME: process.env.DB_USER_NAME || "root",
  DB_PASSWORD:
    process.env.DB_PASSWORD === undefined
      ? "4s-mmsi4"
      : process.env.DB_PASSWORD,
};
const ENV =
  process.env.TS_NODE_DEV !== "true" &&
  (!process.env.NODE_ENV || process.env.NODE_ENV === "product")
    ? product
    : develop;

const database = new Sequelize(
  `${ENV.DB_NAME}`,
  `${ENV.DB_USER_NAME}`,
  `${ENV.DB_PASSWORD}`,
  {
    host: `${ENV.DB_HOST}`,
    dialect: "mariadb",
    logging: false,
    timezone: "+09:00",
  }
);

export default database;

export async function resetDB() {
  try {
    const conn = await mariaDB.createConnection({
      host: `${ENV.DB_HOST}`,
      user: `${ENV.DB_USER_NAME}`,
      password: `${ENV.DB_PASSWORD}`,
    });
    logger.debug(`[データベース] 接続している。。。`);
    await conn
      .query(`DROP DATABASE ${ENV.DB_NAME};`)
      .catch((error) => console.log(error));
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS ${ENV.DB_NAME} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;`
    );
    logger.debug(`[データベース] 接続が完了しました。`);
    await conn.end();
  } catch (error) {
    console.log(error);
  }
}
