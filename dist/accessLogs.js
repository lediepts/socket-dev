"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.warningLogger = exports.successLogger = exports.requestLogger = void 0;
const moment_1 = __importDefault(require("moment"));
const winston_1 = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, colorize, printf } = winston_1.format;
const transport = new winston_daily_rotate_file_1.default({
    filename: "logs/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "1095d",
});
const systemLog = printf(({ level, message }) => {
    return `[${level}] ${(0, moment_1.default)().format("HH:mm:ss")} | ${message}`;
});
const logger = winston_1.default.createLogger({
    level: "http",
    format: combine(systemLog),
    transports: [transport],
});
logger.add(new winston_1.default.transports.Console({
    level: "silly",
    format: combine(colorize(), systemLog),
}));
const requestLogger = (req) => {
    const { loginInfo, method, url } = req;
    if (!/\.[ico|json|png|svg|jpg|css|ttf|js|map]/g.test(url)) {
        const mess = `${loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`} ${method} ${url}` +
            " body:" +
            (process.env.NODE_ENV !== "production" ? JSON.stringify(req.body) : ``);
        logger.http(mess);
    }
};
exports.requestLogger = requestLogger;
const successLogger = (message, req) => {
    const { loginInfo, url, method } = req;
    const mess = `${loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`} | ${method} ${url} | ${message}`;
    logger.info(mess);
};
exports.successLogger = successLogger;
const warningLogger = (message, req) => {
    const { loginInfo, url, method } = req;
    const mess = `${loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`} | ${method} ${url} | ${message}`;
    logger.warn(mess);
};
exports.warningLogger = warningLogger;
const errorLogger = (message, req) => {
    const { loginInfo, url, method } = req;
    const mess = `${loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`} | ${method} ${url} | ${message}`;
    logger.error(mess);
};
exports.errorLogger = errorLogger;
exports.default = logger;
//# sourceMappingURL=accessLogs.js.map