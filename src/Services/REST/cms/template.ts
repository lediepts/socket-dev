import express, { Response } from "express";
import { body, param } from "express-validator";
import { TemplateModel, TemplateSchema } from "../../../Models/Template";
import { ThemeSchema } from "../../../Models/Theme";
import { errorLogger, warningLogger } from "../../../accessLogs";
import database from "../../../database";
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
    const templates = await TemplateSchema.findAll({
      where: {
        // active: true,
      },
      include: [
        {
          model: ThemeSchema,
        },
      ],
      order: [
        ["active", "DESC"],
        ["ver", "DESC"],
      ],
    });
    res.send({
      templates,
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
      const template = await TemplateSchema.findOne({
        where: { id, active: true },
        include: [
          {
            model: ThemeSchema,
          },
        ],
      });
      res.send({
        template,
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
  body("themeId").isNumeric(),
  body("body").isObject(),
  validatorsMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      {
        themeId: number;
        name: string;
        body: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        body: { name, body, themeId },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await TemplateSchema.findOne({ where: { name } });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const rs = await TemplateSchema.create({
        name,
        body,
        themeId,
        owner: loginInfo.groupId,
      });
      IOEmit.emitEvent("cms-template", "created", rs.id, {
        perIndex: PERMISSION.CMS,
      });
      res.send({
        id: rs.id,
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
        body: string;
        style?: string;
        script?: string;
        subOwner: number[];
        formStyle?: string;
        formScript?: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        params: { id },
        body: { name, body, subOwner, script, style, formScript, formStyle },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await TemplateSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      await TemplateSchema.create({
        ...before.toJSON(),
        active: false,
        id: undefined,
      });
      const max = await TemplateSchema.max<number, TemplateModel>("ver", {
        where: {
          uuid: before.uuid,
        },
      });
      await before.update({
        ver: max + 1,
        name,
        body,
        subOwner,
        script,
        style,
        formScript,
        formStyle,
      });
      IOEmit.emitEvent("cms-template", "async", 0, {
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
route.patch(
  "/:id/active",
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  async (req: ServiceRequest<{ id: string }, unknown, {}>, res: Response) => {
    const t = await database.transaction();
    try {
      const {
        loginInfo,
        params: { id },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await TemplateSchema.findByPk(id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }

      const currentActive = await TemplateSchema.findOne({
        where: {
          uuid: before.uuid,
          active: true,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!currentActive) {
        warningLogger("元のレコードが存在していません", req);
        return res.send({
          error: true,
          message: `元のレコードが存在していません`,
        });
      }

      await TemplateSchema.create({
        ...currentActive.toJSON(),
        id: undefined,
        active: false,
      });
      const { name } = before.toJSON();
      await currentActive.update({
        ...before.toJSON(),
        id: undefined,
        active: true,
      });
      await before.destroy({ force: true });

      IOEmit.emitEvent("cms-template", "async", 0, {
        perIndex: PERMISSION.CMS,
      });
      await t.commit();
      res.send({
        message: "Version変更しました",
      });
    } catch (error) {
      await t.rollback();
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
      const before = await TemplateSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      await before.update({
        name: `${before.name}_${new Date().getTime()}`,
        active: false,
      });
      IOEmit.emitEvent("cms-template", "deleted", Number(id), {
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
