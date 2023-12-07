import express, { Response } from "express";
import { body, param } from "express-validator";
import { FormSchema } from "../../Models/Form";
import { WebSchema } from "../../Models/Web";
import { errorLogger, warningLogger } from "../../accessLogs";
import { IFormItem, PERMISSION, ServiceRequest } from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

export const route = express.Router();
route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  try {
    const { loginInfo } = req;
    if (!loginInfo || loginInfo.permissions[PERMISSION.FORM] < 1) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const forms = await FormSchema.findAll({
      where: {
        status: 'created'
      },
      include: [{ model: WebSchema }],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      forms: forms.filter(
        (f) =>
          loginInfo.groupId === 1 ||
          loginInfo.permissions[PERMISSION.CMS] > 1 ||
          f.owner === loginInfo.groupId
      ),
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
      if (!loginInfo || loginInfo.permissions[PERMISSION.FORM] < 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const form = await FormSchema.findOne({
        where: {
          id,
          status: 'created'
        },
        include: [{ model: WebSchema }],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.send({
        form:
          loginInfo.groupId === 1 ||
          loginInfo.permissions[PERMISSION.CMS] > 1 ||
          form?.owner === loginInfo.groupId
            ? form
            : undefined,
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
  body("webId").isNumeric().exists(),
  body("name").isString().notEmpty(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      { name: string; webId: number; startDate?: string; endDate?: string }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { name, webId, endDate, startDate },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.FORM] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await FormSchema.findOne({
        where: {
          name,
          webId,
        },
      });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const { id } = await FormSchema.create({
        name,
        webId,
        endDate,
        startDate,
        owner: loginInfo.groupId,
      });
      IOEmit.emitEvent("form", "created", id, {
        perIndex: PERMISSION.CMS,
        groupId: loginInfo.groupId,
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
      {
        name: string;
        webId: number;
        status: string;
        startDate: string;
        endDate: string;
        items: IFormItem[];
      }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      params: { id },
      body: { name, webId, startDate, endDate, items },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.FORM] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await FormSchema.findByPk(id);
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      const sd = startDate || before.startDate || new Date("1971/01/01");
      const ed = endDate || before.endDate || new Date("2100/01/01");
      if (endDate && before.endDate && new Date(endDate) < new Date(sd)) {
        warningLogger("end date is invalid", req);
        return res.send({
          error: true,
          message: `end date is invalid`,
        });
      }
      if (startDate && before.startDate && new Date(startDate) > new Date(ed)) {
        warningLogger("start date is invalid", req);
        return res.send({
          error: true,
          message: `start date is invalid`,
        });
      }

      if (name) {
        const isNameExist = await FormSchema.findOne({
          where: { webId: before.webId, name },
        });
        if (isNameExist) {
          warningLogger("名前が存在していません", req);
          return res.send({
            error: true,
            message: `名前が存在していません`,
          });
        }
      }
      await before.update({
        name,
        webId,
        startDate,
        endDate,
        items,
      });
      IOEmit.emitEvent("form", "updated", before.id, {
        perIndex: PERMISSION.CMS,
        groupId: loginInfo.groupId,
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
      if (!loginInfo || loginInfo.permissions[PERMISSION.FORM] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const form = await FormSchema.findByPk(id);
      if (!form) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }

      await form.update({
        status:"deleted"
      })
      IOEmit.emitEvent("form", "deleted", form.id, {
        perIndex: PERMISSION.CMS,
        groupId: loginInfo.groupId,
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
