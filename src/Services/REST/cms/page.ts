import express, { Response } from "express";
import { body, param } from "express-validator";
import fs from "fs";
import { constants, copyFile, cp } from "node:fs/promises";
import path from "path";
import { PageModel, PageSchema } from "../../../Models/Page";
import { ThemeSchema } from "../../../Models/Theme";
import { WebSchema } from "../../../Models/Web";
import { errorLogger, warningLogger } from "../../../accessLogs";
import database from "../../../database";
import {
  IPage,
  ITheme,
  IWeb,
  PERMISSION,
  ServiceRequest,
} from "../../../interfaces";
import { IOEmit } from "../../../socketIO";
import { authMiddleware, validatorsMiddleware } from "../../Middlewares";
import pretty from "pretty";

export const route = express.Router();

route.get("/", authMiddleware, async (req: ServiceRequest, res: Response) => {
  try {
    const { loginInfo } = req;
    if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 1) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const pages = await PageSchema.findAll({
      where: {
        // active: true,
      },
      include: [
        {
          model: WebSchema,
        },
        {
          model: ThemeSchema,
        },
      ],
      order: [
        ["active", "DESC"],
        ["ver", "DESC"],
      ],
    });
    res.send({
      pages,
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
    try {
      const {
        loginInfo,
        params: { id },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const page = await PageSchema.findOne({
        where: { id },
        include: [
          {
            model: WebSchema,
          },
          {
            model: ThemeSchema,
          },
        ],
      });
      res.send({
        page,
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
  body("themeId").isNumeric().exists(),
  body("url").isString().notEmpty(),
  body("title").isString().notEmpty(),
  validatorsMiddleware,
  async (
    req: ServiceRequest<
      unknown,
      unknown,
      {
        webId: number;
        themeId: number;
        url: string;
        title: string;
        description?: string;
        body?: string;
        style?: string;
        script?: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        body: { webId, themeId, url, title, description, body, script, style },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }

      const before = await PageSchema.findOne({ where: { webId, url } });
      if (before) {
        warningLogger("既に存在します", req);
        return res.send({
          error: true,
          message: `既に存在します`,
        });
      }
      const rs = await PageSchema.create({
        webId,
        themeId,
        url,
        title,
        description,
        body: body || "",
        owner: loginInfo.groupId,
        script,
        style,
      });
      const newPage = await PageSchema.findByPk(rs.id, {
        include: [
          {
            model: WebSchema,
          },
          {
            model: ThemeSchema,
          },
        ],
      });
      await buildPage(
        newPage as any as IPage & {
          web: IWeb;
          theme: ITheme;
        }
      );
      IOEmit.emitEvent("cms-page", "created", rs.id, {
        perIndex: PERMISSION.CMS,
      });
      res.send({
        id: rs.id,
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
      {
        url?: string;
        title?: string;
        description?: string;
        body?: string;
        style?: string;
        script?: string;
        subOwner?: number[];
        formStyle?: string;
        formScript?: string;
      }
    >,
    res: Response
  ) => {
    try {
      const {
        loginInfo,
        params: { id },
        body: {
          url,
          title,
          description,
          body,
          subOwner,
          script,
          style,
          formScript,
          formStyle,
        },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await PageSchema.findOne({
        where: {
          id,
          active: true,
        },
        include: [
          {
            model: WebSchema,
          },
          {
            model: ThemeSchema,
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
      if (before.status === "公開済") {
        const { id: newId } = await PageSchema.create({
          ...before.toJSON(),
          active: false,
          id: undefined,
        });
        IOEmit.emitEvent("cms-page", "created", newId, {
          perIndex: PERMISSION.CMS,
        });
        const max = await PageSchema.max<number, PageModel>("ver", {
          where: {
            uuid: before.uuid,
          },
        });
        await before.update({
          url,
          title,
          description,
          body,
          subOwner,
          script,
          style,
          formScript,
          formStyle,
          status: "更新中",
          ver: max + 1,
        });
      } else {
        await before.update({
          url,
          title,
          description,
          body,
          subOwner,
          script,
          style,
          formScript,
          formStyle,
          status: "更新中",
        });
      }
      await buildPage(
        before as any as IPage & {
          web: IWeb;
          theme: ITheme;
        }
      );
      IOEmit.emitEvent("cms-page", "updated", Number(id), {
        perIndex: PERMISSION.CMS,
      });
      res.send({
        message: "編集が成功しました",
      });
    } catch (error) {
      console.log(error);
      errorLogger("error", req);
      res.send({
        error: true,
        message: `エラーが発生しました`,
      });
    }
  }
);
route.patch(
  "/:id/active",
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  async (req: ServiceRequest<{ id: string }, unknown, {}>, res: Response) => {
    const t = await database.transaction();
    try {
      const {
        loginInfo,
        params: { id },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await PageSchema.findByPk(id, {
        include: [
          {
            model: WebSchema,
          },
          {
            model: ThemeSchema,
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!before) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      const currentActive = await PageSchema.findOne({
        where: {
          uuid: before.uuid,
          active: true,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!currentActive) {
        warningLogger("元のレコードが存在していません", req);
        return res.send({
          error: true,
          message: `元のレコードが存在していません`,
        });
      }
      await PageSchema.create({
        ...currentActive.toJSON(),
        id: undefined,
        active: false,
      });
      await currentActive.update({
        ...before.toJSON(),
        id: undefined,
        active: true,
      });
      await before.destroy({ force: true });
      await buildPage(
        before as any as IPage & {
          web: IWeb;
          theme: ITheme;
        }
      );
      IOEmit.emitEvent("cms-page", "async", 0, {
        perIndex: PERMISSION.CMS,
      });
      await t.commit();
      res.send({
        message: "Version変更しました",
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
route.delete(
  "/:id",
  param("id").isString().notEmpty(),
  validatorsMiddleware,
  async (req: ServiceRequest<{ id: string }, unknown, {}>, res: Response) => {
    try {
      const {
        loginInfo,
        params: { id },
      } = req;
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const before = await PageSchema.findOne({
        where: {
          id,
          active: true,
        },
        include: [
          {
            model: WebSchema,
          },
          {
            model: ThemeSchema,
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
      await before.update({
        url: `${before.url}_${new Date().getTime()}`,
        active: false,
      });
      IOEmit.emitEvent("cms-page", "deleted", Number(id), {
        perIndex: PERMISSION.CMS,
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

async function buildPage(
  page: IPage & {
    web: IWeb;
    theme: ITheme;
  }
) {
  const staging = path.join(process.cwd(), `staging`);
  if (!fs.existsSync(staging)) {
    fs.mkdirSync(staging);
  }
  const webFolder = path.join(staging, page.web.name);
  if (!fs.existsSync(webFolder)) {
    fs.mkdirSync(webFolder);
  }
  const source = path.join(process.cwd(), "/common.css");
  const destination = path.join(webFolder, "/common.css");
  await copyFile(source, destination, constants.COPYFILE_FICLONE);
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
  const sc = `window.onload = ()=>{
    document.querySelectorAll("a").forEach(elm=>{
      const url = new URL(elm.href)
      if(url.hostname===location.hostname){
        elm.href = url.origin +"/staging/${page.web.name}"+ url.pathname
      }
    })
  }`;
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
  \t${page.theme.head}
  \t<link rel="icon" href="/imgs/${page.web.favicon}">
  \t${generateOGP(
    page.title,
    new URL(page.url, page.web.ogURL).href,
    new URL("/imgs/" + page.web.ogImage, page.web.ogURL).href,
    page.description || page.web.ogDescription
  )}
  <style>
  \t${page.theme.style}
  \t${page.style}
  \t${page.formStyle}
  </style>
  </head>
  <body>
  \t${code}
  <script>
    \t${sc}
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
  if (matchImg) {
    for (const img of matchImg) {
      const source = path.join(process.cwd(), "/localFile/imgs/", img);
      const destination = path.join(imgFolder, img);
      try {
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
      const source = path.join(process.cwd(), "/localFile/docs/", doc);
      const destination = path.join(docFolder, doc);
      try {
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
