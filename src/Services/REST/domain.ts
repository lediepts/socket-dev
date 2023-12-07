import express, { Response } from "express";
import { body, param } from "express-validator";
import { DomainSchema } from "../../Models/Domain";
import { errorLogger, warningLogger } from "../../accessLogs";
import { PERMISSION, ServiceRequest } from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

export const route = express.Router();

route.get("/", async (req: ServiceRequest, res: Response) => {
  try {
    const domains = await DomainSchema.findAll();
    res.send({
      domains,
    });
  } catch (error) {
    errorLogger("error", req);
    res.send({
      error: true,
      message: `エラーが発生しました`,
    });
  }
});

route.post(
  "/",
  body("name").isString().notEmpty(),
  body("displayName").isString().notEmpty(),
  body("clientId").isString().notEmpty(),
  body("tenantId").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      { name: string; clientId: string; displayName: string; tenantId: string }
    >,
    res: Response
  ) => {
    const { body, loginInfo } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.CONFIG] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await DomainSchema.findOne({
        where: {
          name:body.name
        },
      });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const { id } = await DomainSchema.create(body);
      IOEmit.emitEvent("domain", "created", id);
      res.send({
        id,
        message: "作成が成功しました",
      });
    } catch (error) {
      errorLogger("error", req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
route.put(
  "/:id",
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<
      { id: string },
      unknown,
      {
        name?: string;
        clientId?: string;
        displayName?: string;
        tenantId?: string;
      }
    >,
    res: Response
  ) => {
    const {
      params: { id },
      body,
      loginInfo,
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.CONFIG] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await DomainSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      await before.update(body);
      IOEmit.emitEvent("domain", "updated", before.id);
      res.send({
        id,
        message: "編集が成功しました",
      });
    } catch (error) {
      errorLogger("error", req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);

route.delete(
  "/:id",
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  async (req: ServiceRequest<{ id: string }, unknown, {}>, res: Response) => {
    try {
      const {
        loginInfo,
        params: { id },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CONFIG] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await DomainSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      await before.destroy({
        force: true,
      });
      IOEmit.emitEvent("domain", "deleted", Number(id));
      res.send({
        message: "削除が成功しました",
      });
    } catch (error) {
      errorLogger("error", req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
