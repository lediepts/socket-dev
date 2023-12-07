import express, { Response } from "express";
import { DevFormAnswerSchema } from "../../Models/DevFormAnswer";
import { FormSchema } from "../../Models/Form";
import { FormAnswerSchema } from "../../Models/FormAnswer";
import { errorLogger } from "../../accessLogs";
import { IForm, PERMISSION, ServiceRequest } from "../../interfaces";
import { authMiddleware } from "../Middlewares";

interface Answer {
  id: number;
  formId: number;
  form: Omit<IForm, "items">;
  answer: {
    [key: string]: string | number;
  };
  createdAt: string;
  updatedAt: string;
}
interface FormAnswer {
  formId: number;
  formName: string;
  startDate?: string;
  endDate?: string;
  answers: {
    id: number;
    [key: string]: string | number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export const route = express.Router();
route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  const TableModel =
    req.headers.host?.includes('cocolis.caa.go.jp') ? FormAnswerSchema : DevFormAnswerSchema;
  try {
    const { loginInfo } = req;
    if (!loginInfo || loginInfo.permissions[PERMISSION.FORM_ANSWER] < 1) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const items = (await TableModel.findAll({
      where: {},
      include: [
        {
          model: FormSchema,
          attributes: {
            exclude: ["createdAt", "updatedAt", "items", "status"],
          },
        },
      ],
    })) as any as Answer[];
    const formAnswers: FormAnswer[] = [];
    for (const item of items) {
      const index = formAnswers.findIndex((f) => f.formId === item.formId);
      if (index >= 0) {
        formAnswers[index].answers.push({
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          ...item.answer,
        });
      } else {
        formAnswers.push({
          formId: item.formId,
          endDate: item.form.endDate,
          startDate: item.form.startDate,
          formName: item.form.name,
          answers: [
            {
              id: item.id,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              ...item.answer,
            },
          ],
        });
      }
    }
    res.send({
      formAnswers,
    });
  } catch (error) {
    console.log(error);
    errorLogger("error", req);
    res.send({
      error: true,
      message: `エラーが発生しました`,
    });
  }
});
