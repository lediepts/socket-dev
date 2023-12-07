import express, { Response } from "express";
import { body, param } from "express-validator";
import { AccountSchema } from "../../Models/Account";
import { errorLogger, warningLogger } from "../../accessLogs";
import { PERMISSION, ServiceRequest } from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { passwordHash } from "../../utils";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

export const route = express.Router();

route.post(
  "/",
  body("type").isString().notEmpty(),
  body("groupId").isNumeric(),
  body("email").isString().isEmail(),
  body("name").isString().notEmpty(),
  validatorsMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      {
        type: "Default" | "MSAL";
        groupId: number;
        name: string;
        email: string;
        password?: string;
      }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { name, type, groupId, email, password },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.ACCOUNT] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      if (type === "Default" && !password) {
        warningLogger("パスワードが必要です", req);
        return res.send({
          error: true,
          message: `パスワードが必要です`,
        });
      }
      const before = await AccountSchema.findOne({
        where: {
          email,
        },
      });
      if (before) {
        if (before.status === "deleted") {
          warningLogger("削除済みのアカウントです", req);
          return res.send({
            error: true,
            message: "削除済みのアカウントです",
          });
        }
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const { id } = await AccountSchema.create({
        name,
        type,
        groupId,
        email,
        password: password ? passwordHash(password) : "",
      });
      IOEmit.emitEvent("group", "updated", groupId, {
        groupId: id,
        perIndex: PERMISSION.ACCOUNT,
      });
      res.send({
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
      { name: string; action: "active" | "disabled" | "deleted" }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id },
      body: { name, action },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.ACCOUNT] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await AccountSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      const status = action || before.status;
      await before.update({
        name: name || before.name,
        status: loginInfo.id === Number(id) ? undefined : status,
      });
      IOEmit.emitEvent("group", "updated", before.groupId, {
        groupId: before.groupId,
        perIndex: PERMISSION.ACCOUNT,
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
  "/:id/change-group",
  param("id").isString().notEmpty(),
  body("groupId").isNumeric().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<{ id: string }, unknown, { groupId: number }>,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id },
      body: { groupId },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.ACCOUNT] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const account = await AccountSchema.findByPk(id);
      if (!account) {
        warningLogger("アカウントが存在しません", req);
        return res.send({
          error: true,
          message: "アカウントが存在しません",
        });
      }
      const oldGroupID = account.groupId;
      await account.update({
        groupId,
      });
      IOEmit.emitEvent("group", "updated", groupId, {
        perIndex: PERMISSION.ACCOUNT,
        groupId,
      });
      IOEmit.emitEvent("group", "updated", oldGroupID, {
        perIndex: PERMISSION.ACCOUNT,
        groupId: oldGroupID,
      });
      IOEmit.emitEvent("account", "async", parseInt(id));
      res.send({
        message: "所属グループを変更しました",
      });
    } catch (error) {
      errorLogger("エラーが発生しました", req);
      res.send({
        error: true,
        message: "エラーが発生しました",
      });
    }
  }
);
