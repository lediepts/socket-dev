import express, { Response } from "express";
import { body, param } from "express-validator";
import { Op } from "sequelize";
import { AccountSchema } from "../../Models/Account";
import { GroupSchema } from "../../Models/Group";
import { errorLogger, warningLogger } from "../../accessLogs";
import { PERMISSION, ServiceRequest } from "../../interfaces";
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
    const groups = await GroupSchema.findAll({
      where: {
        status: "active",
      },
      include: [
        {
          model: AccountSchema,
          required: false,
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
      order: [
        ["id", "ASC"],
        ["accounts", "id", "ASC"],
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      groups,
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
      if (!loginInfo) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const group = await GroupSchema.findOne({
        where: {
          id,
          status: "active",
        },
        include: [
          {
            model: AccountSchema,
            required: false,
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
        order: [[{ model: AccountSchema, as: "accounts" }, "id", "DESC"]],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.send({
        group,
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
  body("permission").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      { name: string; permission: string; description?: string }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { name, permission, description },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.ACCOUNT] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await GroupSchema.findOne({
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
      const { id } = await GroupSchema.create({
        name,
        permission,
        description,
      });
      IOEmit.emitEvent("group", "created", id, {
        groupId: id,
        perIndex: PERMISSION.ACCOUNT,
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
  authMiddleware,
  async (
    req: ServiceRequest<
      { id: string },
      unknown,
      { name: string; permission: number[]; description: string }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id },
      body: { name, permission, description },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.ACCOUNT] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await GroupSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      await before.update({
        name,
        permission,
        description,
      });
      IOEmit.emitEvent("group", "updated", before.id, {
        groupId: before.id,
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
route.delete(
  "/:id",
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (req: ServiceRequest<{ id: string }>, res: Response) => {
    const {
      loginInfo,
      params: { id },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.ACCOUNT] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const group = await GroupSchema.findByPk(id);
      if (!group) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      const accounts = await AccountSchema.findAll({
        where: {
          groupId: id,
          status: { [Op.ne]: "deleted" },
        },
      });
      await Promise.all(
        accounts.map(async (account) => {
          await account.update({ status: "deleted" });
          IOEmit.emitEvent("group", "updated", account.groupId, {
            groupId: account.groupId,
            perIndex: PERMISSION.ACCOUNT,
          });
        })
      );
      await group.update({ status: "deleted" });
      IOEmit.emitEvent("group", "deleted", group.id, {
        groupId: group.id,
        perIndex: PERMISSION.ACCOUNT,
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
