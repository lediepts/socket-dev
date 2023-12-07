"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDB = void 0;
const sequelize_1 = require("sequelize");
const mariadb_1 = __importDefault(require("mariadb"));
const accessLogs_1 = __importDefault(require("./accessLogs"));
require("dotenv/config");
const product = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    DB_HOST: process.env.DB_HOST ||
        "maria-db-main-eastjp-001.privatelink.mariadb.database.azure.com",
    DB_NAME: process.env.DB_NAME || "caa",
    DB_USER_NAME: process.env.DB_USER_NAME || "db_adm0001@maria-db-main-eastjp-001",
    DB_PASSWORD: process.env.DB_PASSWORD || "S+)S9|%es)b!.8",
};
const develop = {
    PORT: 488,
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_NAME: process.env.DB_NAME || "caa",
    DB_USER_NAME: process.env.DB_USER_NAME || "root",
    DB_PASSWORD: process.env.DB_PASSWORD === undefined
        ? "4s-mmsi4"
        : process.env.DB_PASSWORD,
};
const ENV = process.env.TS_NODE_DEV !== "true" &&
    (!process.env.NODE_ENV || process.env.NODE_ENV === "product")
    ? product
    : develop;
const database = new sequelize_1.Sequelize(`${ENV.DB_NAME}`, `${ENV.DB_USER_NAME}`, `${ENV.DB_PASSWORD}`, {
    host: `${ENV.DB_HOST}`,
    dialect: "mariadb",
    logging: false,
    timezone: "+09:00",
});
exports.default = database;
function resetDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield mariadb_1.default.createConnection({
                host: `${ENV.DB_HOST}`,
                user: `${ENV.DB_USER_NAME}`,
                password: `${ENV.DB_PASSWORD}`,
            });
            accessLogs_1.default.debug(`[データベース] 接続している。。。`);
            yield conn
                .query(`DROP DATABASE ${ENV.DB_NAME};`)
                .catch((error) => console.log(error));
            yield conn.query(`CREATE DATABASE IF NOT EXISTS ${ENV.DB_NAME} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;`);
            accessLogs_1.default.debug(`[データベース] 接続が完了しました。`);
            yield conn.end();
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.resetDB = resetDB;
//# sourceMappingURL=database.js.map