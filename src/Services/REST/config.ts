import express, { Response } from "express";
import { ENVSchema } from "../../Models/ENV";
import { errorLogger } from "../../accessLogs";
import { PERMISSION, ServiceRequest } from "../../interfaces";
import { IOEmit } from "../../socketIO";

export const route = express.Router();

route.get("/", async (req: ServiceRequest, res: Response) => {
  const { loginInfo } = req;
  try {
    const envs = await ENVSchema.findAll();
    const initialValue: { [key: string]: string } = {};
    const config = envs
      .map((v) => v.toJSON())
      .reduce((p, c) => {
        p[c.key] = c.value;
        return p;
      }, initialValue);
    res.send({
      config,
    });
  } catch (error) {
    errorLogger("config ゲット出来なかったです。", req);
    res.send({
      error: true,
      message: `エラーが発生しました`,
    });
  }
});
route.put(
  "/",
  async (
    req: ServiceRequest<
      { id: string },
      unknown,
      {
        [key: string]: string;
      }
    >,
    res: Response
  ) => {
    const { loginInfo, body } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.CONFIG] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      for (const key of Object.keys(body)) {
        let value: string = body[key];
        switch (key) {
          case "blockTime":
            value = `${parseInt(body[key]) * 1000 * 60 * 60}`;
            break;
          case "requireUpdatePassTime":
            value = `${parseInt(body[key]) * 1000 * 60 * 60 * 24}`;
            break;
          case "signinAge":
            value = `${parseInt(body[key]) * 1000 * 60 * 60}`;
            break;
          case "cookieMaxAge":
            value = `${parseInt(body[key]) * 1000 * 60 * 60}`;
            break;

          default:
            break;
        }
        await ENVSchema.update(
          {
            value,
          },
          {
            where: {
              key,
            },
          }
        );
      }
      IOEmit.emitEvent("config", "async", 0);
      res.send({
        message: "編集が成功しました",
      });
    } catch (error) {
      errorLogger("setConfig 出来なかったです。", req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
