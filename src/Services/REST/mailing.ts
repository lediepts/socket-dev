import express, { Response } from "express";
import { body, param } from "express-validator";
import { MailMemberSchema } from "../../Models/MailMember";
import { MailingSchema } from "../../Models/Mailing";
import { errorLogger, warningLogger } from "../../accessLogs";
import {
  IMailMember,
  IMailing,
  PERMISSION,
  ServiceRequest,
} from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

export const route = express.Router();
route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  try {
    const { loginInfo } = req;
    if (!loginInfo) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const mailingAll = await MailingSchema.findAll({
      where: {},
      include: [
        {
          model: MailMemberSchema,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [
        ["id", "ASC"],
        ["mailMembers", "id", "DESC"],
      ],
    });
    const fixedGroups = mailingAll.filter(
      (f) =>
        loginInfo.permissions[PERMISSION.MAIL_ADDRESS] > 1 ||
        (f.allowGroup as number[]).includes(loginInfo.groupId)
    );
    res.send({
      mailings: fixedGroups,
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
      loginInfo,
      params: { id },
    } = req;
    try {
      const mailing = await MailingSchema.findOne({
        where: {
          id,
        },
        include: [
          {
            model: MailMemberSchema,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [
          ["id", "ASC"],
          ["mailMembers", "id", "DESC"],
        ],
      });
      if (!mailing) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      if (
        !loginInfo ||
        !(
          loginInfo.permissions[PERMISSION.MAIL_ADDRESS] > 1 ||
          (mailing.allowGroup as number[]).includes(loginInfo.groupId)
        )
      ) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      res.send({
        mailing,
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
  body("type").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<unknown, unknown, { name: string; type: string }>,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { name, type },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.MAIL_ADDRESS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await MailingSchema.findOne({
        where: {
          name,
        },
      });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }

      const { id } = await MailingSchema.create({
        name,
        type,
      });
      IOEmit.emitEvent("mail-group", "created", id, {
        perIndex: PERMISSION.MAIL_ADDRESS,
      });
      res.send({
        id,
        message: `${name}のメーリングを作成しました`,
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
  "/:id/member",
  param("id").isString().notEmpty(),
  body("email").isString().isEmail().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<{ id: string }, unknown, { email: string }>,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id },
      body: { email },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.MAIL_ADDRESS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await MailingSchema.findOne({
        where: {
          id,
        },
      });
      if (!before) {
        warningLogger("メールグループが存在ありません", req);
        return res.send({
          error: true,
          message: `メールグループが存在ありません`,
        });
      }

      const isExists = await MailMemberSchema.findOne({
        where: {
          groupId: before.id,
          email,
        },
      });
      if (isExists) {
        warningLogger("メールアドレスは既に登録済みです", req);
        return res.send({
          error: true,
          message: `メールアドレスは既に登録済みです`,
        });
      }
      await MailMemberSchema.create({
        groupId: before.id,
        email,
      });
      IOEmit.emitEvent("mail-group", "updated", before.id, {
        perIndex: PERMISSION.MAIL_ADDRESS,
      });
      res.send({
        id,
        message: "追加しました",
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
  authMiddleware,
  async (
    req: ServiceRequest<
      { id: string },
      unknown,
      {
        name?: string;
        allowGroup?: number[];
      }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id },
      body: { name, allowGroup },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.MAIL_ADDRESS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await MailingSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      if (name) {
        const isUseName = await MailingSchema.findOne({
          where: {
            name,
          },
        });
        if (isUseName) {
          warningLogger(
            "メールグループ名は存在あるので別の名前を設定してください",
            req
          );
          return res.send({
            error: true,
            message: `メールグループ名は存在あるので別の名前を設定してください`,
          });
        }
      }

      await before.update({
        name,
        allowGroup,
      });
      IOEmit.emitEvent("mail-group", "updated", before.id, {
        perIndex: PERMISSION.MAIL_ADDRESS,
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
  authMiddleware,
  async (
    req: ServiceRequest<{ id: string }, unknown, unknown, { force?: string }>,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id },
      query: { force },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.MAIL_ADDRESS] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await MailingSchema.findOne({
        where: {
          id,
        },
        include: [
          {
            model: MailMemberSchema,
          },
        ],
      });
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }

      if (force) {
        for (const member of (
          before as any as IMailing & { mailMembers: IMailMember[] }
        ).mailMembers) {
          await MailingSchema.destroy({
            where: {
              id: member.id,
            },
          });
        }
      }
      await before.destroy();
      IOEmit.emitEvent("mail-group", "deleted", before.id, {
        perIndex: PERMISSION.MAIL_ADDRESS,
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
route.delete(
  "/:id/:memberId",
  param("id").isString().notEmpty(),
  param("memberId").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<
      { id: string; memberId: string },
      unknown,
      { email: string }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id, memberId },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.MAIL_ADDRESS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const groupMail = await MailingSchema.findByPk(id);
      if (!groupMail) {
        warningLogger("メールグループが存在ありません", req);
        return res.send({
          error: true,
          message: `メールグループが存在ありません`,
        });
      }

      const member = await MailMemberSchema.findByPk(memberId);
      if (!member) {
        warningLogger("メールが存在ありません", req);
        return res.send({
          error: true,
          message: `メールが存在ありません`,
        });
      }
      await member.destroy();
      IOEmit.emitEvent("mail-group", "updated", groupMail.id, {
        perIndex: PERMISSION.MAIL_ADDRESS,
      });
      res.send({
        id: member.id,
        message: `${member.email}を削除しました`,
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
