import express, { Response } from "express";
import { body } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import { AccountSchema } from "../../Models/Account";
import { DomainSchema } from "../../Models/Domain";
import { GroupSchema } from "../../Models/Group";
import { ServiceRequest, TokenInfo } from "../../interfaces";
import {
  AUTH_TOKEN_SECRET,
  setAuthCookie,
  validatorsMiddleware,
} from "../Middlewares";
import { WebAuthorUserSchema } from "../../Models/WebAuthorUser";
import { WebAuthorSchema } from "../../Models/WebAuthor";

export const route = express.Router();

route.get("/", async ({}: ServiceRequest, res: Response) => {
  const token = sign({ info: "funny!" }, AUTH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: 1000 * 60,
  });
  res.cookie("__csrf", token, {
    maxAge: 1000 * 60,
    httpOnly: true,
    secure: false,
    signed: true,
  });
  res.sendStatus(202);
});

route.post(
  "/",
  body("email").isString().notEmpty().isEmail(),
  body("name").isString().notEmpty(),
  validatorsMiddleware,
  async (
    {
      body: { email, name },
      signedCookies: { __csrf },
    }: ServiceRequest<unknown, unknown, { email: string; name: string }>,
    res: Response
  ) => {
    try {
      try {
        const check = verify(String(__csrf), AUTH_TOKEN_SECRET);
        if (!check) throw undefined;
      } catch (error) {
        console.log(error);
        return res.send({
          error: true,
          message: `ログイン失敗しました。`,
        });
      }
      res.clearCookie("__csrf");
      const domain = await DomainSchema.findOne({
        where: {
          name: email.split("@").pop(),
        },
      });
      if (!domain) {
        return res.send({
          error: true,
          message: `ログイン失敗しました。`,
        });
      }
      const account = await AccountSchema.findOne({
        where: {
          type: "MSAL",
          email,
          status: "active",
        },
        include: [
          {
            model: GroupSchema,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });
      if (!account) {
        return res.send({
          error: true,
          message: `ログイン失敗しました。`,
        });
      }
      if (account.name !== name) {
        await account.update({
          name,
        });
      }
      const webAuthorUser = await WebAuthorUserSchema.findOne({
        where: {
          accountId: account.id,
        },
      });
      const webAuthor = await WebAuthorSchema.findByPk(
        webAuthorUser?.toJSON().webAuthorId
      );
      const tokenInfo: TokenInfo = {
        id: account.id,
        name: account.name,
        email: account.email,
        groupId: (account as any).group.id,
        groupName: (account as any).group.name,
        type: "Default",
        permissions: (account as any).group.permission,
        workflow: webAuthor
          ? {
              email: webAuthor.email,
              admin: webAuthor.admin,
            }
          : undefined,
      };
      await setAuthCookie(tokenInfo, res);
      res.send({ tokenInfo });
    } catch (error) {
      console.log(error);
      res.clearCookie("__csrf");
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
