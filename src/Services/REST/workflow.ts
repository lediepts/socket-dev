import express, { Response } from "express";
import { body, param } from "express-validator";
import fs from "fs";
import { constants, copyFile, cp, readFile } from "node:fs/promises";
import path from "path";
import pretty from "pretty";
import { Op } from "sequelize";
import { AccountSchema } from "../../Models/Account";
import { FileLocalSchema } from "../../Models/FileLocal";
import { PageSchema } from "../../Models/Page";
import { ThemeSchema } from "../../Models/Theme";
import { WebSchema } from "../../Models/Web";
import { WebAuthorSchema } from "../../Models/WebAuthor";
import { WorkflowSchema } from "../../Models/Workflow";
import { errorLogger, warningLogger } from "../../accessLogs";
import database from "../../database";
import {
  IAccount,
  IPage,
  ITheme,
  IWeb,
  IWebAuthor,
  IWorkflow,
  PERMISSION,
  ServiceRequest,
} from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { BearMail } from "../../utils/BearMail";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

export const route = express.Router();

route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  const { loginInfo } = req;
  try {
    if (
      !loginInfo ||
      (!loginInfo.workflow && loginInfo.permissions[PERMISSION.CONFIG] < 4)
    ) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const rs = (await WorkflowSchema.findAll({
      include: [
        {
          model: AccountSchema,
          as: "senderUser",
          attributes: ["id", "email", "groupId"],
        },
        {
          model: AccountSchema,
          as: "approverUser",
          attributes: ["id", "email", "groupId"],
        },
        {
          model: WebAuthorSchema,
          include: [
            {
              model: AccountSchema,
              attributes: ["id", "email", "groupId"],
            },
          ],
          attributes: ["id", "email", "admin", "createdAt"],
        },
        {
          model: PageSchema,
          attributes: ["id", "webId", "title", "url"],
          include: [
            {
              model: WebSchema,
            },
            {
              model: ThemeSchema,
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
    })) as any as (IWorkflow & {
      page: IPage;
      senderUser: IAccount;
      approverUser: IAccount;
      webAuthor: IWebAuthor & {
        accounts: IAccount[];
      };
    })[];
    const workflows = rs.filter((f) => {
      return (
        loginInfo.permissions[PERMISSION.CONFIG] > 4 ||
        f.webAuthor.accounts.find((a) => a.id === loginInfo.id)
      );
    });
    res.send({
      workflows,
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
      if (
        !loginInfo ||
        (!loginInfo.workflow && loginInfo.permissions[PERMISSION.CONFIG] < 4)
      ) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const workflow = (await WorkflowSchema.findOne({
        where: {
          id,
        },
        include: [
          {
            model: AccountSchema,
            as: "senderUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: AccountSchema,
            as: "approverUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: WebAuthorSchema,
            include: [
              {
                model: AccountSchema,
                attributes: ["id", "email", "groupId"],
              },
            ],
            attributes: ["id", "email", "admin", "createdAt"],
          },
          {
            model: PageSchema,
            attributes: ["id", "webId", "title", "url"],
            include: [
              {
                model: WebSchema,
              },
              {
                model: ThemeSchema,
              },
            ],
          },
        ],
      })) as any as IWorkflow & {
        page: IPage;
        senderUser: IAccount;
        approverUser: IAccount;
        webAuthor: IWebAuthor & {
          accounts: IAccount;
        };
      };
      res.send({
        workflow,
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
  body("authorizers").isArray().notEmpty(),
  body("pageIds").isObject().exists(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      {
        authorizers: number[];
        pageIds: {
          public: number[];
          unPublic: number[];
        };
        hopeTime?: number;
      }
    >,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { authorizers, pageIds, hopeTime },
    } = req;
    const t = await database.transaction();
    try {
      if (
        !loginInfo ||
        (loginInfo.permissions[PERMISSION.CMS] < 2 &&
          loginInfo.permissions[PERMISSION.CONFIG] < 4)
      ) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const emails: string[] = [];
      const pageURLs: string[] = [];
      for (const pageId of pageIds.public) {
        const page = await PageSchema.findByPk(pageId);
        if (!page) throw "page not found";
        pageURLs.push(page.url);
      }
      for (const pageId of pageIds.unPublic) {
        const page = await PageSchema.findByPk(pageId);
        if (!page) throw "page not found";
        pageURLs.push(page.url);
      }
      for (const authorizer of authorizers) {
        const author = await WebAuthorSchema.findByPk(authorizer);
        if (!author) throw "author not found";
        emails.push(author.email);
        for (const pageId of pageIds.public) {
          await PageSchema.update(
            {
              status: "申請中",
            },
            {
              where: {
                id: pageId,
                status: {
                  [Op.ne]: "申請中",
                },
              },
            }
          );
          await WorkflowSchema.create({
            authorizer,
            pageId,
            sender: loginInfo.id,
            hopeTime,
            type: "public",
          });
        }
        for (const pageId of pageIds.unPublic) {
          await PageSchema.update(
            {
              status: "申請中",
            },
            {
              where: {
                id: pageId,
                status: {
                  [Op.ne]: "申請中",
                },
              },
            }
          );
          await WorkflowSchema.create({
            authorizer,
            pageId,
            sender: loginInfo.id,
            hopeTime,
            type: "unPublic",
          });
        }
      }
      await BearMail.defaultSend({
        subject: "【消費者庁ポータル（仮）】申請依頼",
        html: `
        <p>承認依頼があります。</p>
        <p>
        申請者：${loginInfo.groupName}-${loginInfo.name}
        </p>
        <br>
        <p>
        対象ページ
        </p>
        <ul>
        ${pageURLs.map((v) => {
          return `<li>${v}</li>`;
        })}
        </ul>
        <p>
        ご確認をお願いします。
        </p>
        <p>
        <a href="https://cocolis-portal.caa.go.jp/workflow">確認リンク</a>
        </p>
        `,
        to: emails,
      });
      await t.commit();

      IOEmit.emitEvent("cms-page", "async", 0);
      IOEmit.emitEvent("workflow", "async", 0);
      res.send({
        message: `ワークフローを追加しました`,
      });
    } catch (error) {
      await t.rollback();
      errorLogger("error", req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
route.put(
  "/remand/",
  body("id").isNumeric().exists(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<unknown, unknown, { id: number }>,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { id },
    } = req;
    try {
      const before = await WorkflowSchema.findOne({
        where: {
          id,
        },
        include: [
          {
            model: AccountSchema,
            as: "senderUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: AccountSchema,
            as: "approverUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: WebAuthorSchema,
            include: [
              {
                model: AccountSchema,
                attributes: ["id", "email", "groupId"],
              },
            ],
            attributes: ["id", "email", "admin", "createdAt"],
          },
          {
            model: PageSchema,
            attributes: ["id", "webId", "title", "url"],
            include: [
              {
                model: WebSchema,
              },
              {
                model: ThemeSchema,
              },
            ],
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
      if (!loginInfo || loginInfo.id !== before.sender) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const wf = before.toJSON() as any as IWorkflow & {
        page: IPage;
        senderUser: IAccount;
        approverUser: IAccount;
        webAuthor: IWebAuthor & {
          accounts: IAccount;
        };
      };
      await before.update({
        approver: loginInfo.id,
        other: `${loginInfo.email}が差し戻ししました`,
        status: "remanded",
      });
      await PageSchema.update(
        {
          status: "更新中",
        },
        {
          where: {
            id: wf.pageId,
          },
        }
      );
      IOEmit.emitEvent("cms-page", "updated", wf.pageId);
      IOEmit.emitEvent("workflow", "updated", id);
      res.send({
        message: `承認依頼が差し戻しされました`,
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
  "/reject/",
  body("id").isNumeric().exists(),
  body("other").isString().exists(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<unknown, unknown, { id: number; other: string }>,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { id, other },
    } = req;
    try {
      if (
        !loginInfo ||
        (loginInfo.workflow && loginInfo.permissions[PERMISSION.CONFIG] < 4)
      ) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await WorkflowSchema.findOne({
        where: {
          id,
        },
        include: [
          {
            model: AccountSchema,
            as: "senderUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: AccountSchema,
            as: "approverUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: WebAuthorSchema,
            include: [
              {
                model: AccountSchema,
                attributes: ["id", "email", "groupId"],
              },
            ],
            attributes: ["id", "email", "admin", "createdAt"],
          },
          {
            model: PageSchema,
            attributes: ["id", "webId", "title", "url"],
            include: [
              {
                model: WebSchema,
              },
              {
                model: ThemeSchema,
              },
            ],
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

      const wf = before.toJSON() as any as IWorkflow & {
        page: IPage;
        senderUser: IAccount;
        approverUser: IAccount;
        webAuthor: IWebAuthor & {
          accounts: IAccount;
        };
      };
      await before.update({
        approver: loginInfo.id,
        other: `${before.other} \n${other}`,
        status: "rejected",
      });
      await PageSchema.update(
        {
          status: "更新中",
        },
        {
          where: {
            id: wf.pageId,
          },
        }
      );
      IOEmit.emitEvent("cms-page", "updated", wf.pageId);
      IOEmit.emitEvent("workflow", "updated", id);
      res.send({
        message: `承認依頼が却下しされました`,
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
  "/approval/",
  body("id").isNumeric().exists(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<unknown, unknown, { id: number }>,
    res: Response
  ) => {
    const {
      loginInfo,
      body: { id },
    } = req;
    const t = await database.transaction();
    try {
      if (
        !loginInfo ||
        (!loginInfo.workflow && loginInfo.permissions[PERMISSION.CONFIG] < 4)
      ) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await WorkflowSchema.findOne({
        where: {
          id,
        },
        include: [
          {
            model: AccountSchema,
            as: "senderUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: AccountSchema,
            as: "approverUser",
            attributes: ["id", "email", "groupId"],
          },
          {
            model: WebAuthorSchema,
            include: [
              {
                model: AccountSchema,
                attributes: ["id", "email", "groupId"],
              },
            ],
            attributes: ["id", "email", "admin", "createdAt"],
          },
          {
            model: PageSchema,
            attributes: ["id", "webId", "title", "url"],
            include: [
              {
                model: WebSchema,
              },
              {
                model: ThemeSchema,
              },
            ],
          },
        ],
      });
      if (!before) {
        warningLogger("Workflow存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }

      const wf = before.toJSON() as any as IWorkflow & {
        page: IPage;
        senderUser: IAccount;
        approverUser: IAccount;
        webAuthor: IWebAuthor & {
          accounts: IAccount;
        };
      };

      const page = await PageSchema.findByPk(wf.pageId, {
        include: [
          {
            model: WebSchema,
          },
          {
            model: ThemeSchema,
          },
        ],
      });
      if (!page) {
        warningLogger("page存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      // create file
      await buildPublicPage(
        page as any as IPage & {
          web: IWeb;
          theme: ITheme;
        }
      );

      await before.update({
        approver: loginInfo.id,
        other: `${loginInfo.name}が承認しました`,
        status: "accepted",
      });

      await page.update({
        status: "公開済",
      });

      await t.commit();
      IOEmit.emitEvent("cms-page", "updated", wf.pageId);
      IOEmit.emitEvent("workflow", "updated", id);
      res.send({
        message: `承認しました`,
      });
    } catch (error) {
      await t.rollback();
      console.log(error);
      errorLogger("error", req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);

export async function buildPublicPage(
  page: IPage & {
    web: IWeb;
    theme: ITheme;
  }
) {
  const www = path.join(process.cwd(), "/cocolis/");
  if (!fs.existsSync(www)) {
    fs.mkdirSync(www);
  }
  const webFolder = path.join(www, page.web.name);
  if (!fs.existsSync(webFolder)) {
    fs.mkdirSync(webFolder);
  }
  const commonCssFile = path.join(process.cwd(), "/common.css");
  const commonCss = await readFile(commonCssFile, { encoding: "utf8" });
  try {
    await cp(
      path.join(process.cwd(), "/fonts"),
      path.join(webFolder, "/fonts"),
      {
        recursive: true,
      }
    );
    console.log("copy fonts finished");
  } catch (error) {
    console.log(error.message);
  }
  const imgFolder = path.join(webFolder, `imgs`);
  if (!fs.existsSync(imgFolder)) {
    fs.mkdirSync(imgFolder);
  }
  const docFolder = path.join(webFolder, `docs`);
  if (!fs.existsSync(docFolder)) {
    fs.mkdirSync(docFolder);
  }
  const filePaths = page.url.split("/").filter((f) => !!f);
  const filename = filePaths.pop();
  if (!filename) throw 1;
  const folderPath = path.join(webFolder, filePaths.join("/"));
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  let code = page.theme.body;
  const tmp = code.match(/(?<={block:)(\d|\w){13}(?=})/gm);
  if (!tmp) return;
  tmp.forEach((id) => {
    code = code.replace(
      `{block:${id}}`,
      page.body[id] || `<div data-editable="${id}"></div>`
    );
  });
  const html = `<!doctype html>
<html lang="ja">
<head>
  ${page.theme.head
    .replace('<link rel="stylesheet" type="text/css" href="/common.css">', "")
    .trim()}
  <link rel="icon" href="/imgs/${page.web.favicon}">
  \t${generateOGP(
    page.title,
    new URL(page.url, page.web.ogURL).href,
    new URL("/imgs/" + page.web.ogImage, page.web.ogURL).href,
    page.description || page.web.ogDescription
  )}
  <style>
  \t${commonCss}
  \t${page.theme.style}
  \t${page.style}
  \t${page.formStyle}
  </style>
</head>

<body>
  \t${code}
  <script>
    \t${page.theme.script}
    \t${page.script}
    \t${page.formScript}
  </script>
</body>
</html>`;
  const htmlContent = pretty(html, { ocd: true });
  await fs.writeFileSync(path.join(folderPath, filename), htmlContent);
  const matchImg = html.match(
    /(?<=href="\/[A-z0-9\/.\-_%]+)[A-z0-9_]+.(jpg|png|ico)|(?<=src="\/[A-z0-9\/.\-_%]+)[A-z0-9_]+.(jpg|png|gif|webp|svg)|(?<=content="[A-z0-9\/.\-_%:]+)[A-z0-9_]+.(jpg|png|webp|svg)|(?<=url[("'`A-z0-9\/.\-_%:]+)[A-z0-9_]+.(jpg|png|webp|svg)/gim
  );
  const fileLocals = await FileLocalSchema.findAll();
  if (matchImg) {
    for (const img of matchImg) {
      const file = fileLocals.find((f) => f.name === img);
      const source = path.join(process.cwd(), "/localFile/imgs/", img);
      const destination = path.join(imgFolder, img);
      try {
        if (file) {
          await file.update({
            pageUses: Array.from(new Set([...file.pageUses, page.id])),
          });
        }
        await copyFile(source, destination, constants.COPYFILE_FICLONE);
        console.log(`Copy ${img} Success`);
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  const matchDoc = html.match(
    /(?<=href="\/[A-z0-9\/.\-_%]+)[A-z0-9_]+.(csv|doc|docx|xls(x)?|pdf)/gim
  );
  if (matchDoc) {
    for (const doc of matchDoc) {
      const file = fileLocals.find((f) => f.name === doc);
      const source = path.join(process.cwd(), "/localFile/docs/", doc);
      const destination = path.join(docFolder, doc);
      try {
        if (file) {
          await file.update({
            pageUses: Array.from(new Set([...file.pageUses, page.id])),
          });
        }
        await copyFile(source, destination, constants.COPYFILE_FICLONE);
        console.log(`Copy ${doc} Success`);
      } catch (error) {
        console.log(error.message);
      }
    }
  }
}
function generateOGP(
  title: string,
  ogURL: string,
  ogImage: string,
  description: string
) {
  return `
  <title>${title}</title>
  <meta property="og:type" content= "website" >
  <meta property="og:url" content="${ogURL}">
  <meta property="og:site_name" content="${title}" >
  <meta property="og:image" content="${ogImage}" >
  <meta name="twitter:card" content="summary">
  <meta name="twitter:domain" content="${ogURL}">
  <meta name="twitter:title" property="og:title" content="${title}" >
  <meta name="twitter:description" property="og:description" content="${description}" >`;
}
