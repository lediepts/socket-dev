import express, { Response } from "express";
import { errorLogger } from "../../accessLogs";
import { PERMISSION, ServiceRequest } from "../../interfaces";
import { authMiddleware } from "../Middlewares";
import { ScheduleSchema } from "../../Models/Schedule";

export const route = express.Router();
route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  try {
    const { loginInfo } = req;
    if (!loginInfo || loginInfo.permissions[PERMISSION.CONFIG] < 1) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const schedules = await ScheduleSchema.findAll();
    res.send({
      schedules,
    });
  } catch (error) {
    console.log(error);
    errorLogger("error", req);
    res.send({
      error: true,
      message: `エラーが発生しました`,
    });
  }
});
