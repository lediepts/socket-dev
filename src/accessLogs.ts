import moment from "moment";
import winston, { format } from "winston";
// import DailyRotateFile from "winston-daily-rotate-file";
import { ServiceRequest } from "./interfaces";

const { combine, colorize, printf } = format;

// const transport: DailyRotateFile = new DailyRotateFile({
//   filename: "logs/%DATE%.log",
//   datePattern: "YYYY-MM-DD",
//   zippedArchive: true,
//   maxSize: "20m",
//   maxFiles: "1095d",
// });
const systemLog = printf(({ level, message }) => {
  return `[${level}] ${moment().format("HH:mm:ss")} | ${message}`;
});

const logger = winston.createLogger({
  format: combine(systemLog),
  transports: [
    new winston.transports.Http({
      level: "silly",
      format: winston.format.json(),
    }),
    new winston.transports.Console({
      level: "silly",
      format: combine(colorize(), winston.format.simple(), systemLog),
    }),
  ],
});

// logger.add(
//   new winston.transports.Console({
//     level: "silly",
//     format: combine(colorize(), systemLog),
//   })
// );
export const requestLogger = (req: ServiceRequest) => {
  const { loginInfo, method, url } = req;
  if (!/\.[ico|json|png|svg|jpg|css|ttf|js|map]/g.test(url)) {
    const mess = `${
      loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`
    } ${method} ${url}`;
    logger.http(mess);
    const { body, params, query } = req;
    Object.keys(body).length > 0 && console.log("body:", body);
    Object.keys(params).length > 0 && console.log("params:", params);
    Object.keys(query).length > 0 && console.log("query:", query);
  }
};
export const successLogger = (message: string, req: ServiceRequest<any>) => {
  const { loginInfo } = req;
  const mess = `${
    loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`
  } | ${message}`;
  logger.info(mess);
};
export const warningLogger = (message: string, req: ServiceRequest<any>) => {
  const { loginInfo } = req;
  const mess = `${
    loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`
  } | ${message}`;
  logger.warn(mess);
};
export const errorLogger = (message: string, req: ServiceRequest<any>) => {
  const { loginInfo } = req;
  const mess = `${
    loginInfo ? `[${loginInfo.groupName}]${loginInfo.name}` : `匿名`
  } | ${message}`;
  logger.error(mess);
};

export default logger;
