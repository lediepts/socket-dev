import express, { Response } from "express";
import { body, param } from "express-validator";
import { Op } from "sequelize";
import { AccountSchema } from "../../Models/Account";
import { WebAuthorSchema } from "../../Models/WebAuthor";
import { WebAuthorUserSchema } from "../../Models/WebAuthorUser";
import { errorLogger, warningLogger } from "../../accessLogs";
import database from "../../database";
import { IAccount, IWebAuthor, ServiceRequest } from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

export const route = express.Router();

route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  try {
    const webAuthors = await WebAuthorSchema.findAll({
      include: [
        {
          model: AccountSchema,
          where: {
            status: {
              [Op.ne]: "deleted",
            },
          },
          attributes: [
            "id",
            "groupId",
            "type",
            "name",
            "email",
            "blockedAt",
            "status",
          ],
        },
      ],
    });
    res.send({
      webAuthors,
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
    const {
      params: { id },
    } = req;
    try {
      const webAuthor = await WebAuthorSchema.findOne({
        where: {
          id,
        },
        attributes: [
          "id",
          "groupId",
          "type",
          "name",
          "email",
          "blockedAt",
          "status",
        ],
        include: [
          {
            model: AccountSchema,
          },
        ],
      });
      res.send({
        webAuthor,
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
  body("email").isString().notEmpty().isEmail(),
  body("userIds").isArray(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<unknown, unknown, { email: string; userIds: number[] }>,
    res: Response
  ) => {
    const {
      body: { email, userIds },
      loginInfo,
    } = req;
    const t = await database.transaction();
    try {
      if (!loginInfo || loginInfo.groupId !== 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await WebAuthorSchema.findOne({
        where: {
          email,
        },
      });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const { id } = await WebAuthorSchema.create({
        email,
      });
      for (const accountId of userIds) {
        await WebAuthorUserSchema.create({
          accountId,
          webAuthorId: id,
        });
      }

      await t.commit();
      IOEmit.emitEvent("author", "created", id);
      res.send({
        id,
        message: `承認可能一覧に${email}を追加しました`,
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
route.put(
  "/",
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<unknown, unknown, { email: string; userIds: number[] }>,
    res: Response
  ) => {
    const {
      body: { email, userIds },
      loginInfo,
    } = req;
    const t = await database.transaction();
    try {
      if (!loginInfo || loginInfo.groupId !== 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const emailModel = await WebAuthorSchema.findOne({
        where: {
          email,
        },
        include: AccountSchema,
      });
      if (!emailModel) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      const accounts = (
        emailModel as any as IWebAuthor & { accounts: IAccount[] }
      ).accounts;
      for (const acc of accounts.filter(
        (f) => !userIds.find((id) => id === f.id)
      )) {
        await WebAuthorUserSchema.destroy({
          where: {
            accountId: acc.id,
            webAuthorId: emailModel.id,
          },
        });
      }
      for (const accountId of userIds) {
        await WebAuthorUserSchema.findOrCreate({
          where: {
            accountId,
            webAuthorId: emailModel.id,
          },
          defaults: {
            accountId,
            webAuthorId: emailModel.id,
          },
        });
      }

      await t.commit();
      IOEmit.emitEvent("author", "updated", emailModel.id);
      res.send({
        message: `承認${email}にユーザ連携編集しました`,
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
  "/:email",
  param("email").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (req: ServiceRequest<{ email: string }, unknown>, res: Response) => {
    const {
      params: { email },
      loginInfo,
    } = req;
    const t = await database.transaction();
    try {
      if (!loginInfo || loginInfo.groupId !== 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const emailModel = await WebAuthorSchema.findOne({
        where: {
          email,
        },
        include: AccountSchema,
      });
      if (!emailModel) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      const accounts = (
        emailModel as any as IWebAuthor & { accounts: IAccount[] }
      ).accounts;
      for (const account of accounts) {
        await WebAuthorUserSchema.destroy({
          where: {
            accountId: account.id,
            webAuthorId: emailModel.id,
          },
        });
      }
      await emailModel.destroy();

      await t.commit();
      IOEmit.emitEvent("author", "deleted", emailModel.id);
      res.send({
        message: `承認${email}削除しました`,
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
