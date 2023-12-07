"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const FileLocal_1 = require("../../Models/FileLocal");
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
const Middlewares_1 = require("../Middlewares");
const localFileFolder = path_1.default.join(process.cwd(), `localFile`);
if (!fs_1.default.existsSync(localFileFolder)) {
    fs_1.default.mkdirSync(localFileFolder);
}
const imagesFolder = path_1.default.join(localFileFolder, `imgs`);
if (!fs_1.default.existsSync(imagesFolder)) {
    fs_1.default.mkdirSync(imagesFolder);
}
const docsFolder = path_1.default.join(localFileFolder, `docs`);
if (!fs_1.default.existsSync(docsFolder)) {
    fs_1.default.mkdirSync(docsFolder);
}
const storage = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, localFileFolder);
        },
        filename: function (_req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    limits: { fileSize: 1024 * 1024 * 10 },
});
exports.route = express_1.default.Router();
exports.route.get("/", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo } = req;
    try {
        if (!loginInfo || loginInfo.permissions[0] < 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const fileLocals = yield FileLocal_1.FileLocalSchema.findAll();
        (0, accessLogs_1.successLogger)("get all success", req);
        res.send({
            images: fileLocals.filter((f) => f.type === "imgs"),
            docs: fileLocals.filter((f) => f.type === "docs"),
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.get("/gallery", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo } = req;
    try {
        if (!loginInfo || loginInfo.permissions[0] < 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const result = (yield FileLocal_1.FileLocalSchema.findAll({
            where: {
                type: "imgs",
            },
        })).map((v) => ({
            src: v.path,
            name: v.name,
            alt: v.name,
            tag: "一般",
        }));
        res.send({
            result,
            statusCode: 200,
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.get("/sync", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imgList = fs_1.default.readdirSync(imagesFolder);
        for (const file of imgList) {
            const size = fs_1.default.statSync(path_1.default.join(imagesFolder, file)).size;
            const ext = path_1.default.extname(file).toLowerCase();
            yield FileLocal_1.FileLocalSchema.findOrCreate({
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
        const fileList = fs_1.default.readdirSync(docsFolder);
        for (const file of fileList) {
            const size = fs_1.default.statSync(path_1.default.join(docsFolder, file)).size;
            const ext = path_1.default.extname(file).toLowerCase();
            yield FileLocal_1.FileLocalSchema.findOrCreate({
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
    }
    catch (error) {
        console.log(error);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.get("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[0] < 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const fileLocal = yield FileLocal_1.FileLocalSchema.findByPk(id);
        (0, accessLogs_1.successLogger)("get One success", req);
        res.send({
            file: fileLocal,
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.post("/upload", storage.single("file"), (0, express_validator_1.body)("data").exists(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file, loginInfo, body: { data }, } = req;
    const { desc } = JSON.parse(data);
    try {
        let createdId = 0;
        if (!file)
            throw "file not found";
        if (!loginInfo || loginInfo.permissions[0] < 2) {
            yield fs_1.default.rmSync(file.path, { force: true });
            return res.send({
                error: true,
                message: "権限不足",
            });
        }
        if (file.mimetype.match(/^image/)) {
            const exists = path_1.default.join(imagesFolder, file.filename);
            if (fs_1.default.existsSync(exists)) {
                (0, accessLogs_1.errorLogger)("ファイル名は存在あります", req);
                return res.send({
                    error: true,
                    message: `ファイル名は存在あります`,
                });
            }
            yield fs_1.default.renameSync(file.path, exists);
            const { id } = yield FileLocal_1.FileLocalSchema.create({
                name: file.filename,
                path: `/imgs/${file.filename}`,
                type: "imgs",
                ext: path_1.default.extname(exists).toLowerCase(),
                size: file.size,
                desc,
            });
            createdId = id;
        }
        else if (file.mimetype.match(/^application|text/)) {
            const exists = path_1.default.join(docsFolder, file.filename);
            if (fs_1.default.existsSync(exists)) {
                (0, accessLogs_1.errorLogger)("ファイル名は存在あります", req);
                return res.send({
                    error: true,
                    message: `ファイル名は存在あります`,
                });
            }
            yield fs_1.default.renameSync(file.path, exists);
            const { id } = yield FileLocal_1.FileLocalSchema.create({
                name: file.filename,
                path: `/docs/${file.filename}`,
                type: "docs",
                ext: path_1.default.extname(exists).toLowerCase(),
                size: file.size,
                desc,
            });
            createdId = id;
        }
        else {
            yield fs_1.default.rmSync(file.path);
        }
        socketIO_1.IOEmit.emitEvent("local", "created", createdId, {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`ファイル名: ${file.filename}をアップロドが成功しました`, req);
        res.send({
            message: "アップロードが完了しました。",
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.delete("/:id", (0, express_validator_1.param)("id").exists(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[0] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const fileInDB = yield FileLocal_1.FileLocalSchema.findByPk(id);
        if (!fileInDB) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const curPath = path_1.default.join(localFileFolder, fileInDB.path);
        if (!fileInDB || !fs_1.default.existsSync(curPath)) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `ファイル名は存在ありません`,
            });
        }
        yield fileInDB.destroy({ force: true });
        yield fs_1.default.rmSync(curPath, { force: true });
        socketIO_1.IOEmit.emitEvent("local", "deleted", Number(id), {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`ファイル名: ${fileInDB.path}を削除が成功しました`, req);
        res.send({
            message: "削除が成功しました",
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=local.js.map