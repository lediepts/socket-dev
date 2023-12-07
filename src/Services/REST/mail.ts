import express, { Response } from "express";
import { body } from "express-validator";
import { AccountSchema } from "../../Models/Account";
import { GroupSchema } from "../../Models/Group";
import { MailMemberSchema } from "../../Models/MailMember";
import { MailingSchema } from "../../Models/Mailing";
import { SendMailHistorySchema } from "../../Models/SendMailHistory";
import { errorLogger } from "../../accessLogs";
import {
  IMailMember,
  IMailing,
  PERMISSION,
  ServiceRequest,
} from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { BearMail } from "../../utils/BearMail";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

export const route = express.Router();
route.get(
  "/history",
  authMiddleware,
  async (req: ServiceRequest, res: Response) => {
    try {
      const { loginInfo } = req;
      if (!loginInfo) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const groups = await GroupSchema.findAll();
      const users = await AccountSchema.findAll();
      const mailings = await MailingSchema.findAll();
      const histories = await SendMailHistorySchema.findAll({
        where:
          loginInfo.permissions[PERMISSION.MAIL] > 4
            ? {}
            : {
                organization: loginInfo.groupId,
              },
        limit: 20,
        order: [["id", "DESC"]],
      });
      res.send({
        histories: histories.map((v) => {
          const data = v.toJSON();
          return {
            ...data,
            sender: users.find((f) => f.id === data.sender)?.name,
            organization: groups.find((f) => f.id === data.organization)?.name,
            mailing: mailings.find((f) => f.id === data.mailingId)?.name,
          };
        }),
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
  "/send",
  body("mailingIds").isArray({ min: 1 }),
  body("subject").isString().notEmpty(),
  body("html").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      {
        mailingIds: number[];
        subject: string;
        html: string;
      }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { subject, html, mailingIds },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.MAIL] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      for (const mailingId of mailingIds) {
        const ml = await MailingSchema.findOne({
          where: {
            id: mailingId,
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
        if (!ml) continue;
        try {
          await BearMail.sendToMailing({
            mailingId,
            subject,
            html,
            sender: loginInfo.id,
            organization: loginInfo.groupId,
            mailing: (
              ml.toJSON() as any as IMailing & {
                mailMembers: IMailMember[];
              }
            ).mailMembers.map((v) => v.email),
          });

          res.send({
            message: "送信完了しました",
          });
        } catch (error) {
          console.log(error);
          errorLogger("送信失敗しました", req);
          res.send({
            error: true,
            message: "送信失敗しました",
          });
        }
        IOEmit.emitEvent("mail-history", "async", 0, {
          perIndex: PERMISSION.MAIL,
        });
      }
    } catch (error) {
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
