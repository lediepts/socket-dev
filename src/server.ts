import fs from "fs";
import cookieParser from "cookie-parser";
import express, { Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { restApi } from "./Services/REST";
import { authApi } from "./Services/Auth";
import logger, { requestLogger } from "./accessLogs";
import { ServiceRequest } from "./interfaces";
import { authMiddleware, cookieMiddleware } from "./Services/Middlewares";
import path from "path";
import { formApi } from "./Services/form";
import timer from "./timer";

const app = express();
export const server = createServer(app);

app.use(cors());
app.use(cookieParser("NY17STOajOfHAIpNMzLC1OUpkDHrA3ycOK9To"));
app.use(
  express.json({
    limit: "30mb",
  })
);
app.use(express.urlencoded({ extended: false }));

// middleware
app.use(cookieMiddleware, (req: ServiceRequest, _res: Response, next) => {
  if(["/admin/host/ping","/liveness"].indexOf(req.url) === -1){
    requestLogger(req);
  }
  next();
});

// router setting
app.use("/api", restApi);

app.use("/auth", authApi);
app.use("/form", formApi);

app.use(
  "/imgs",
  authMiddleware,
  express.static(path.join(process.cwd(), "/localFile/imgs"))
);
app.use(
  "/docs",
  authMiddleware,
  express.static(path.join(process.cwd(), "/localFile/docs"))
);

app.get("/liveness", (req, res) => {
  res.sendStatus(200);
});
app.get("/common.css", (req, res) => {
  res.sendFile(path.join(process.cwd(), "common.css"));
});
app.use(
  "/staging",
  authMiddleware,
  express.static(path.join(process.cwd(), "staging"))
);
app.use(
  "/fonts",
  authMiddleware,
  express.static(path.join(process.cwd(), "fonts"))
);
app.get("/staging/*", async (req, res) => {
  const filePath = req.url.includes(".html")
    ? path.join(process.cwd(), req.url)
    : path.join(process.cwd(), req.url, "index.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendStatus(404);
  }
});
app.use(express.static(path.join(process.cwd(), "build")));
app.get("/*", async (_req, res) => {
  res.sendFile(path.join(process.cwd(), "build", "index.html"));
});

function run() {
  const port = process.env.TS_NODE_DEV !== "true" ? 8080 : 500;
  server.listen(port, () => {
    logger.info(`サーバの起動が完了しました。`);
    logger.debug(`URL: http://localhost:${port}/`);
    timer()
    logger.debug(`スケジュール管理が準備完了しました`);
  });
}
export default {
  run,
};
