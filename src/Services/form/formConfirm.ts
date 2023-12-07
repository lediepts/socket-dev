import { format } from "date-fns";
import express, { Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import { DevFormAnswerSchema } from "../../Models/DevFormAnswer";
import { FormSchema } from "../../Models/Form";
import { WebSchema } from "../../Models/Web";
import { errorLogger } from "../../accessLogs";
import { IForm, IWeb, ServiceRequest } from "../../interfaces";
import { authMiddleware } from "../Middlewares";
import { sign, verify } from "jsonwebtoken";
import { MailingSchema } from "../../Models/Mailing";
import { MailMemberSchema } from "../../Models/MailMember";

export const route = express.Router();

route.post(
  "/:id/confirm",
  authMiddleware,
  async (
    req: ServiceRequest<{ id: string }, unknown, { [key: string]: string }>,
    res: Response
  ) => {
    const {
      body,
      params: { id },
    } = req;
    try {
      const form = await FormSchema.findOne({
        where: {
          id: parseInt(id),
        },
        include: [{ model: WebSchema }],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!form) {
        res.setHeader("Content-Type", "text/html");
        return res.send("<h1>エラーが発生しました</h1>");
      }

      const {
        items,
        web: { name: webName },
      } = form.toJSON() as any as IForm & {
        web: IWeb;
      };
      const sd = new Date(form.startDate || 0);
      const ed = new Date(form.endDate || 4102412400000);
      if (sd > new Date() || ed < new Date()) {
        const filePath =
          process.env.TS_NODE_DEV === "true"
            ? path.join(process.cwd(), "staging", webName, "error.html")
            : path.join("/home/site/wwwroot", "staging", webName, "error.html");
        const contents = await readFile(filePath, { encoding: "utf8" });
        const str = `<p style='text-align:center;color:#EC0000;'>
            本フォームの受付期間は、${
              form.startDate ? format(sd, "yyyy年MM月dd日") + "から" : ""
            }${form.endDate ? format(ed, "yyyy年MM月dd日") + "まで" : ""}です。
            </p>
            <p style='text-align:center;color:#EC0000;'>期間外の回答は無効となります、ご了承ください。</p>`;
        const html = contents.replace("{content}", str);
        res.setHeader("Content-Type", "text/html");
        return res.send(html);
      }
      const filePath =
        process.env.TS_NODE_DEV === "true"
          ? path.join(process.cwd(), "staging", webName, "form-confirm.html")
          : path.join(
              "/home/site/wwwroot",
              "staging",
              webName,
              "form-confirm.html"
            );
      const contents = await readFile(filePath, { encoding: "utf8" });
      let str = `<form action="/form/${id}/accepted" method="POST" style="max-width:960px;margin:0 auto">`;
      str += `<p style="text-align:center;padding:10px;font-weight:bold;font-size:x-large;">入力内容確認</p>
      <noscript>
      <p style="text-align:center;padding:10px;background:#475569;color:#fff;">入力画面に戻る場合はブラウザの戻るボタン（左アイコン）を押してください。</p>
      </noscript>
      <p style="text-align:center;padding:10px;">内容を確認後[送信]ボタンを押して内容を登録してください。</p>
    
    `;
      const formItems: {
        name: string;
        value?: string;
        display: string;
        error?: boolean;
      }[] = [];
      items
        .filter((f) => f.format !== "文章（回答なし）")
        .forEach((item) => {
          if (item.branch && item.branchItems) {
            const child = item.branchItems.find(
              (f) => f.option === body[item.name]
            );
            const selectOption = item.options.find(
              (f) => f.id === child?.option
            );
            formItems.push({
              error: item.required && !selectOption,
              display: item.display,
              name: item.name,
              value: selectOption?.text || "",
            });
            if (child) {
              str += `<div style="border: 1px solid #ccc;margin:0.5rem auto;box-shadow:0 1px 4px #eee;">
                <p style="background-color: #eee;padding:4px 10px;">${item.display}</p>
                <p style="padding:1rem;">${selectOption?.text}</p>
              </div>`;
              child.list?.forEach((c) => {
                formItems.push({
                  error: c.required && !body[c.name],
                  display: c.display,
                  name: c.name,
                  value: body[c.name],
                });
                str += `<div style="border: 1px solid ${
                  c.required && !body[c.name] ? "#EC0000" : "#ccc"
                };margin:0.5rem auto;box-shadow:0 1px 4px #eee;">
            <p style="background-color: #eee;padding:4px 10px;">${c.display}</p>
            <p style="padding:1rem;color:${
              c.required && !body[c.name] ? "#EC0000" : "unset"
            };">${
                  body[c.name] ||
                  (c.required ? "必須項目が入力されていません。" : "")
                }</p>
          </div>`;
              });
            } else if (item.required) {
              str += `<div style="border: 1px solid #EC0000;margin:0.5rem auto;box-shadow:0 1px 4px #eee;">
                <p style="background-color: #eee;padding:4px 10px;">${item.display}</p>
                <p style="padding:1rem;color:#EC0000">必須項目が入力されていません。</p>
              </div>`;
            }
          } else {
            if (item.format === "選択肢" && item.multiSelect) {
              const value = (
                typeof body[item.name] === "string"
                  ? [body[item.name]]
                  : body[item.name]
                  ? Array.from(body[item.name])
                  : []
              )
                ?.map((v) => {
                  return item.options.find((f) => f.id === v)?.text;
                })
                .filter((f) => !!f)
                ?.map((v) => `<p">${v}</p>`);
              str += `<div style="border: 1px solid ${
                item.required && (!value || value.length === 0)
                  ? "#EC0000"
                  : "#ccc"
              };margin:0.5rem auto;box-shadow:0 1px 4px #eee;">
              <p style="background-color: #eee;padding:4px 10px;">${
                item.display
              }</p>
              <div style="padding:1rem;color:${
                item.required && (!value || value.length === 0)
                  ? "#EC0000"
                  : "unset"
              };">${
                value?.join("") ||
                (item.required ? "必須項目が入力されていません。" : "")
              }</div>
            </div>`;
              formItems.push({
                error: item.required && (!value || value.length === 0),
                display: item.display,
                name: item.name,
                value: (typeof body[item.name] === "string"
                  ? [body[item.name]]
                  : body[item.name]
                  ? Array.from(body[item.name])
                  : []
                )
                  ?.map((v) => {
                    return item.options.find((f) => f.id === v)?.text;
                  })
                  .filter((f) => !!f)
                  .join(","),
              });
            } else {
              formItems.push({
                error: item.required && !body[item.name],
                display: item.display,
                name: item.name,
                value: body[item.name],
              });
              str += `<div style="border: 1px solid ${
                item.required && !body[item.name] ? "#EC0000" : "#ccc"
              };margin:0.5rem auto;box-shadow:0 1px 4px #eee;">
              <p style="background-color: #eee;padding:4px 10px;">${
                item.display
              }</p>
              <p style="padding:1rem;color:${
                item.required && !body[item.name] ? "#EC0000" : "unset"
              };">${
                body[item.name] ||
                (item.required ? "必須項目が入力されていません。" : "")
              }</p>
            </div>`;
            }
          }
        });
      const err = formItems.find((f) => f.error);
      if (!err) {
        str += `<input type="hidden" name="data" value='${sign(
          {
            info: formItems.reduce((p, c) => {
              return {
                ...p,
                [c.display]: c.value,
              };
            }, {}),
          },
          "data",
          {
            algorithm: "HS256",
            expiresIn: "30d",
          }
        )}' >`;
      }
      str += `<div data-name="action"
      style="position: relative; display: flex; justify-content: space-around; align-items: center;flex-wrap: wrap; margin: 2rem auto; max-width: 1024px;">
      ${
        err
          ? ""
          : `
          <button type="submit"
      style="display:flex;width:256px;height:56px;justify-content:center;align-items:center;background:#1D4ED8;border-radius:4px;border:none;font-size:15px;color:#fff;font-weight:500;cursor:pointer;transition:all 200ms;margin: 10px 0;">送信</button>`
      }
        <script>
        const action = document.querySelector('[data-name="action"]')
        const btn = document.createElement('button')
        btn.type="button"
        btn.style.display = "flex"
        btn.style.width = "256px"
        btn.style.height = "56px"
        btn.style.justifyContent = "center"
        btn.style.alignItems = "center"
        btn.style.background = "#475569"
        btn.style.borderRadius = "4px"
        btn.style.border = "none"
        btn.style.fontSize = "15px"
        btn.style.color = "#fff"
        btn.style.fontWeight = "500"
        btn.style.cursor = "pointer"
        btn.style.transition = "all 200ms"
        btn.innerText = '入力画面に戻る'
        btn.onclick = () => { window.history.back() }
        action.insertBefore(btn,action.firstChild)
      </script>
    </div>`;
      str += "</form>";

      const html = contents.replace("{form-confirm}", str);
      res.setHeader("Content-Type", "text/html");
      return res.send(html);
    } catch (error) {
      console.log(error);
      errorLogger(error.message || error, req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
route.post(
  "/:id/accepted",
  authMiddleware,
  async (req: ServiceRequest<{ id: string }, unknown>, res: Response) => {
    const {
      body,
      params: { id },
    } = req;
    try {
      const form = await FormSchema.findOne({
        where: {
          id: parseInt(id),
        },
        include: [{ model: WebSchema }],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      const obj = verify(body.data, "data") as { info: object };
      if (!form) {
        return res.redirect("/error.html");
      }
      const values = Object.values(obj.info).join(",") as string;
      function extractEmails(text: string) {
        return text.match(
          /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gi
        );
      }
      const emails= extractEmails(values)
      if(emails?.length){
        const [mailing] = await MailingSchema.findOrCreate({
          where: {
            name:form.name+"_回答",
          },
          defaults:{
            name:form.name+"_回答",
            type:"user"
          }
        });
        for (const email of emails) {
          const isExists = await MailMemberSchema.findOne({
            where: {
              groupId: mailing.id,
              email,
            },
          });
          if(!isExists) {
            await MailMemberSchema.create({
              groupId: mailing.id,
              email,
            });
          }
        }
      }
      await DevFormAnswerSchema.create({
        formId: form.id,
        answer: JSON.stringify(obj.info),
      });
      const {
        web: { name: webName },
      } = form.toJSON() as any as IForm & {
        web: IWeb;
      };
      res.redirect("/staging/" + webName + "/form-success.html");
    } catch (error) {
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
