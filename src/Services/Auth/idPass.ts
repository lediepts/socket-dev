import express, { Response } from "express";
import { body, param } from "express-validator";
import { ENVSchema } from "../../Models/ENV";
import { PasswordHistorySchema } from "../../Models/PasswordHistory";
import { IPasswordHistory, ServiceRequest, TokenInfo } from "../../interfaces";
import {
  createOTPAuth,
  generateRandomBase32,
  idPassLogin,
  passwordCompare,
  passwordHash,
} from "../../utils";
import { setAuthCookie, validatorsMiddleware } from "../Middlewares";
import { WebAuthorUserSchema } from "../../Models/WebAuthorUser";
import { WebAuthorSchema } from "../../Models/WebAuthor";

export const route = express.Router();

route.post(
  "/",
  body("email").isString().notEmpty().isEmail(),
  body("password").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  validatorsMiddleware,
  async (
    {
      body: { email, password },
    }: ServiceRequest<unknown, unknown, { email: string; password: string }>,
    res: Response
  ) => {
    try {
      const env = await ENVSchema.findAll();
      const account = await idPassLogin(email, password, env);
      if (!account) {
        return res.send({
          error: true,
          message: `ログイン失敗しました。`,
        });
      }

      const requireUpdatePassTime =
        env.find((f) => f.key === "requireUpdatePassTime")?.value ||
        "7776000000"; //　default 90日
      if (
        account.updatePasswordAt + Number(requireUpdatePassTime) <=
        new Date().getTime()
      ) {
        return res.send({
          require: "update_password",
        });
      }
      let otpSecret = account.otpSecret;
      if (!otpSecret) {
        otpSecret = generateRandomBase32();
        await account.update({
          otpSecret,
        });
        const otpauthUrl = createOTPAuth(email, otpSecret).toString();
        return res.send({
          require: "verify_otp",
          otpSecret,
          otpauthUrl,
        });
      } else {
        return res.send({
          require: "otp",
          otpSecret,
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);

// set new password
route.patch(
  "/:email",
  param("email").isString().notEmpty().isEmail(),
  body("password").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  body("newPassword").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  validatorsMiddleware,
  async (
    {
      params: { email },
      body: { password, newPassword },
    }: ServiceRequest<
      { email: string },
      unknown,
      { password: string; newPassword: string }
    >,
    res: Response
  ) => {
    try {
      const env = await ENVSchema.findAll();
      const account = await idPassLogin(email, password, env);
      if (!account) {
        return res.send({
          error: true,
          message: `ログイン失敗しました。`,
        });
      }
      const passwordHistoryMax =
        env.find((f) => f.key === "passwordHistoryMax")?.value || "3"; // default 3回;
      const passHistories = (
        (account as any).passwordHistories as IPasswordHistory[]
      )
        .map((v) => v.password)
        .splice(0, Number(passwordHistoryMax) - 1);

      let hpMatch = false;
      for (const oldPass of passHistories) {
        if (passwordCompare(newPassword, oldPass)) {
          hpMatch = true;
          break;
        }
      }
      if (hpMatch) {
        return res.send({
          error: true,
          message: `過去${passwordHistoryMax}回までに使用したパスワードは使用できません`,
        });
      }
      await PasswordHistorySchema.create({
        accountId: account.id,
        password: account.password,
      });
      await account.update({
        updatePasswordAt: new Date().getTime(),
        password: passwordHash(newPassword),
      });
      let otpSecret = account.otpSecret;
      if (!otpSecret) {
        otpSecret = generateRandomBase32();
        await account.update({
          otpSecret,
        });
        const otpauthUrl = createOTPAuth(email, otpSecret).toString();
        return res.send({
          require: "verify_otp",
          otpSecret,
          otpauthUrl,
        });
      } else {
        return res.send({
          require: "otp",
          otpSecret,
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);

route.post(
  "/verify/:email",
  param("email").isString().notEmpty().isEmail(),
  body("password").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  body("otpSecret").exists(),
  body("token").exists(),
  validatorsMiddleware,
  async (
    {
      params: { email },
      body: { password, otpSecret, token },
    }: ServiceRequest<
      { email: string },
      unknown,
      {
        token: string;
        otpSecret: string;
        password: string;
      }
    >,
    res: Response
  ) => {
    try {
      const env = await ENVSchema.findAll();
      const account = await idPassLogin(email, password, env);
      if (!account || account.otpSecret !== otpSecret) {
        return res.send({
          error: true,
          message: `ログイン失敗しました。`,
        });
      }
      const otpauth = createOTPAuth(email, account.otpSecret);
      const delta = otpauth.validate({ token, window: 1 });
      if (delta === null)
        return res.send({
          error: true,
          message: `ログイン失敗しました。`,
        });
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
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
