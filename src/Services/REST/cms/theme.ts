import express, { Response } from "express";
import { body, param } from "express-validator";
import { TemplateSchema } from "../../../Models/Template";
import { ThemeSchema } from "../../../Models/Theme";
import { errorLogger, warningLogger } from "../../../accessLogs";
import {
  ITemplate,
  ITheme,
  PERMISSION,
  ServiceRequest,
} from "../../../interfaces";
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
    const themes = await ThemeSchema.findAll({
      where: {},
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      themes,
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
      const theme = await ThemeSchema.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.send({
        theme,
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
  validatorsMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      {
        name: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        body: { name },
      } = req;
      if (!loginInfo || loginInfo.groupId !== 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await ThemeSchema.findOne({ where: { name } });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const { id } = await ThemeSchema.create({
        name,
        head: `<meta charset="utf-8" >
        <meta name="viewport" content="width=device-width, initial-scale=1" >
        <link rel="stylesheet" type="text/css" href="/common.css">`,
        body: "",
        script: "",
        style: ``,
      });
      IOEmit.emitEvent("cms-theme", "created", id, {
        perIndex: PERMISSION.CMS,
      });
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
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  async (
    req: ServiceRequest<
      { id: string },
      unknown,
      {
        name: string;
        head: string;
        body: string;
        style: string;
        script: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        params: { id },
        body: { name, body, head, script, style },
      } = req;
      if (!loginInfo || loginInfo.groupId !== 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await ThemeSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      await before.update({
        name,
        body,
        head,
        script,
        style,
      });
      IOEmit.emitEvent("cms-theme", "updated", Number(id), {
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
      if (!loginInfo || loginInfo.groupId !== 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await ThemeSchema.findByPk(id, {
        include: {
          model: TemplateSchema,
        },
      });
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      if (
        (before as any as ITheme & { templates: ITemplate[] }).templates
          .length > 0
      ) {
        warningLogger("テンプレートで使用しているため削除できません", req);
        return res.send({
          error: true,
          message: `テンプレートで使用しているため削除できません`,
        });
      }
      // for (const template of (
      //   before as any as ITheme & { templates: ITemplate[] }
      // ).templates) {
      //   await TemplateSchema.destroy({
      //     where: {
      //       id: template.id,
      //     },
      //   });
      // }
      await before.destroy({
        force: true,
      });
      IOEmit.emitEvent("cms-theme", "deleted", Number(id), {
        perIndex: PERMISSION.CMS,
      });
      res.send({
        message: "削除が成功しました",
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
