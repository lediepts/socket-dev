import express, { Response } from "express";
import { body, param } from "express-validator";
import { WebSchema } from "../../../Models/Web";
import { errorLogger, warningLogger } from "../../../accessLogs";
import { PERMISSION, ServiceRequest } from "../../../interfaces";
import { IOEmit } from "../../../socketIO";
import { authMiddleware, validatorsMiddleware } from "../../Middlewares";

export const route = express.Router();

route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  try {
    const { loginInfo } = req;
    if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 1) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const webs = await WebSchema.findAll({});
    res.send({
      webs,
    });
  } catch (error) {
    errorLogger("error", req);
    res.send({
      error: true,
      message: `エラーが発生しました`,
    });
  }
});
route.get(
  "/:id",
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (req: ServiceRequest, res: Response) => {
    try {
      const {
        loginInfo,
        params: { id },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const web = await WebSchema.findByPk(id);
      res.send({
        web,
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
route.post(
  "/",
  body("name").isString().notEmpty(),
  body("favicon").isString().notEmpty(),
  body("ogURL").isString().notEmpty(),
  body("ogImage").isString().notEmpty(),
  validatorsMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      {
        name: string;
        favicon: string;
        ogURL: string;
        ogImage: string;
        ogDescription?: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        body: { name, ogDescription, ogImage, ogURL, favicon },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await WebSchema.findOne({ where: { name } });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const rs = await WebSchema.create({
        name,
        ogDescription,
        ogImage,
        ogURL,
        favicon,
      });
      IOEmit.emitEvent("cms-web", "created", rs.id, {
        perIndex: PERMISSION.CMS,
      });
      res.send({
        id: rs.id,
        message: "作成が成功しました",
      });
    } catch (error) {
      console.log(error);
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
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  async (
    req: ServiceRequest<
      { id: string },
      unknown,
      {
        name?: string;
        favicon?: string;
        ogURL?: string;
        ogImage?: string;
        ogDescription?: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        params: { id },
        body: { name, ogDescription, ogImage, ogURL, favicon },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await WebSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      await before.update({
        name,
        ogDescription,
        ogImage,
        ogURL,
        favicon,
      });
      IOEmit.emitEvent("cms-web", "updated", Number(id), {
        perIndex: PERMISSION.CMS,
      });
      res.send({
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
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await WebSchema.findByPk(id);
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
      IOEmit.emitEvent("cms-web", "deleted", Number(id), {
        perIndex: PERMISSION.CMS,
      });
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
