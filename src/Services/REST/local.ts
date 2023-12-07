import express, { Response } from "express";
import { body, param } from "express-validator";
import fs from "fs";
import multer from "multer";
import path from "path";
import { FileLocalSchema } from "../../Models/FileLocal";
import { errorLogger, warningLogger } from "../../accessLogs";
import { PERMISSION, ServiceRequest } from "../../interfaces";
import { IOEmit } from "../../socketIO";
import { authMiddleware, validatorsMiddleware } from "../Middlewares";

const localFileFolder = path.join(process.cwd(), `localFile`);
if (!fs.existsSync(localFileFolder)) {
  fs.mkdirSync(localFileFolder);
}
const imagesFolder = path.join(localFileFolder, `imgs`);
if (!fs.existsSync(imagesFolder)) {
  fs.mkdirSync(imagesFolder);
}
const docsFolder = path.join(localFileFolder, `docs`);
if (!fs.existsSync(docsFolder)) {
  fs.mkdirSync(docsFolder);
}
const storage = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, localFileFolder);
    },
    filename: function (_req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 10 },
});
export const route = express.Router();

route.get("/", authMiddleware, async (req: ServiceRequest, res) => {
  const { loginInfo } = req;
  try {
    if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 1) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const fileLocals = await FileLocalSchema.findAll();
    res.send({
      images: fileLocals.filter((f) => f.type === "imgs"),
      docs: fileLocals.filter((f) => f.type === "docs"),
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
route.get("/gallery", authMiddleware, async (req: ServiceRequest, res) => {
  const { loginInfo } = req;
  try {
    if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 1) {
      errorLogger("権限なし", req);
      return res.send({
        error: true,
        message: "権限なし",
      });
    }
    const result = (
      await FileLocalSchema.findAll({
        where: {
          type: "imgs",
        },
      })
    ).map((v) => ({
      src: v.path,
      name: v.name,
      alt: v.name,
      tag: "一般",
    }));
    res.send({
      result,
      statusCode: 200,
    });
  } catch (error) {
    errorLogger("error", req);
    res.send({
      error: true,
      message: `エラーが発生しました`,
    });
  }
});
route.get("/sync", async (req, res) => {
  try {
    await FileLocalSchema.sync({
      force: true,
    });
    const imgList = fs.readdirSync(imagesFolder);
    for (const file of imgList) {
      const size = fs.statSync(path.join(imagesFolder, file)).size;
      const ext = path.extname(file).toLowerCase();
      await FileLocalSchema.findOrCreate({
        where: {
          path: `/imgs/${file}`,
        },
        defaults: {
          name: file,
          type: "imgs",
          ext,
          size,
          path: `/imgs/${file}`,
          desc: "",
        },
      });
    }
    const fileList = fs.readdirSync(docsFolder);
    for (const file of fileList) {
      const size = fs.statSync(path.join(docsFolder, file)).size;
      const ext = path.extname(file).toLowerCase();
      await FileLocalSchema.findOrCreate({
        where: {
          path: `/docs/${file}`,
        },
        defaults: {
          name: file,
          type: "docs",
          ext,
          size,
          path: `/docs/${file}`,
          desc: "",
        },
      });
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
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
  async (req: ServiceRequest, res) => {
    const {
      loginInfo,
      params: { id },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 1) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const fileLocal = await FileLocalSchema.findByPk(id);
      res.send({
        file: fileLocal,
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
  "/upload",
  storage.single("file"),
  body("data").exists(),
  validatorsMiddleware,
  authMiddleware,
  async (
    req: ServiceRequest<unknown, unknown, { data: string }>,
    res: Response
  ) => {
    const {
      file,
      loginInfo,
      body: { data },
    } = req;
    const { desc } = JSON.parse(data);
    try {
      let createdId: number = 0;
      if (!file) throw "file not found";
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 2) {
        await fs.rmSync(file.path, { force: true });
        return res.send({
          error: true,
          message: "権限不足",
        });
      }
      if (file.mimetype.match(/^image/)) {
        const exists = path.join(imagesFolder, file.filename);
        if (fs.existsSync(exists)) {
          errorLogger("ファイル名は存在あります", req);
          return res.send({
            error: true,
            message: `ファイル名は存在あります`,
          });
        }
        await fs.renameSync(file.path, exists);
        const { id } = await FileLocalSchema.create({
          name: file.filename,
          path: `/imgs/${file.filename}`,
          type: "imgs",
          ext: path.extname(exists).toLowerCase(),
          size: file.size,
          desc,
        });
        createdId = id;
      } else if (file.mimetype.match(/^application|text/)) {
        const exists = path.join(docsFolder, file.filename);
        if (fs.existsSync(exists)) {
          errorLogger("ファイル名は存在あります", req);
          return res.send({
            error: true,
            message: `ファイル名は存在あります`,
          });
        }
        await fs.renameSync(file.path, exists);
        const { id } = await FileLocalSchema.create({
          name: file.filename,
          path: `/docs/${file.filename}`,
          type: "docs",
          ext: path.extname(exists).toLowerCase(),
          size: file.size,
          desc,
        });
        createdId = id;
      } else {
        await fs.rmSync(file.path);
      }

      IOEmit.emitEvent("local", "created", createdId, {
        perIndex: PERMISSION.CMS,
      });
      res.send({
        message: "アップロードが完了しました。",
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
  param("id").exists(),
  validatorsMiddleware,
  authMiddleware,
  async (req: ServiceRequest, res) => {
    const {
      loginInfo,
      params: { id },
    } = req;
    try {
      if (!loginInfo || loginInfo.permissions[PERMISSION.CMS] < 4) {
        errorLogger("権限なし", req);
        return res.send({
          error: true,
          message: "権限なし",
        });
      }
      const fileInDB = await FileLocalSchema.findByPk(id);
      if (!fileInDB) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `存在していません`,
        });
      }
      const curPath = path.join(localFileFolder, fileInDB.path);
      if (!fileInDB || !fs.existsSync(curPath)) {
        warningLogger("存在していません", req);
        return res.send({
          error: true,
          message: `ファイル名は存在ありません`,
        });
      }
      await fileInDB.destroy({ force: true });
      await fs.rmSync(curPath, { force: true });
      IOEmit.emitEvent("local", "deleted", Number(id), {
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
