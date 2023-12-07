import express, { Response } from "express";
import { body } from "express-validator";
import { ServiceRequest } from "../../../interfaces";
import { validateHTML } from "../../../utils";
import { authMiddleware, validatorsMiddleware } from "../../Middlewares";

export const route = express.Router();

route.post(
  "/",
  body("html").isString().exists(),
  validatorsMiddleware,
  authMiddleware,
  async (
    { body: { html } }: ServiceRequest<unknown, unknown, { html: string }>,
    res: Response
  ) => {
    try {
      const rs = await validateHTML(html);
      const errList = rs.filter(
        (v: any) =>
          v.type === "error" &&
          !v.message.match(/<!DOCTYPE html>/g) &&
          !v.message.match(/Element “style” not allowed/g) &&
          !v.message.match(/“head”/g)
      );
      res.send({
        errList,
        message:
          errList.length > 0
            ? "ソースコードをチェックされてエラー一覧を確認してください"
            : "ソースコードをチェックされて問題がありません",
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);
