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
const Theme_1 = require("../../../Models/Theme");
const accessLogs_1 = require("../../../accessLogs");
const Middlewares_1 = require("../../Middlewares");
const express_validator_1 = require("express-validator");
const socketIO_1 = require("../../../socketIO");
const Template_1 = require("../../../Models/Template");
exports.route = express_1.default.Router();
exports.route.get("/", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo } = req;
        if (!loginInfo || loginInfo.permissions[0] < 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const themes = yield Theme_1.ThemeSchema.findAll({
            where: {},
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        (0, accessLogs_1.successLogger)("get all success", req);
        res.send({
            themes,
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
exports.route.get("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, params: { id }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const theme = yield Theme_1.ThemeSchema.findOne({
            where: { id },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        (0, accessLogs_1.successLogger)("get one success", req);
        res.send({
            theme,
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
exports.route.post("/", (0, express_validator_1.body)("name").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, body: { name }, } = req;
        if (!loginInfo || loginInfo.groupId !== 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Theme_1.ThemeSchema.findOne({ where: { name } });
        if (before) {
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const { id } = yield Theme_1.ThemeSchema.create({
            name,
            head: `<meta charset="utf-8" >
        <meta name="viewport" content="width=device-width, initial-scale=1" >
        <link rel="stylesheet" type="text/css" href="/common.css">`,
            body: "",
            script: "",
            style: ``,
        });
        socketIO_1.IOEmit.emitEvent("cms-theme", "created", id, {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`theme: ${name}を作成が成功しました`, req);
        res.send({
            id,
            message: "作成が成功しました",
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
exports.route.put("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, params: { id }, body: { name, body, head, script, style }, } = req;
        if (!loginInfo || loginInfo.groupId !== 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Theme_1.ThemeSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield before.update({
            name,
            body,
            head,
            script,
            style,
        });
        socketIO_1.IOEmit.emitEvent("cms-theme", "updated", Number(id), {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`theme: ${name}を編集が成功しました`, req);
        res.send({
            message: "編集が成功しました",
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
exports.route.delete("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, params: { id }, } = req;
        if (!loginInfo || loginInfo.groupId !== 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Theme_1.ThemeSchema.findByPk(id, {
            include: {
                model: Template_1.TemplateSchema,
            },
        });
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        if (before.templates
            .length > 0) {
            (0, accessLogs_1.warningLogger)("テンプレートで使用しているため削除できません", req);
            return res.send({
                error: true,
                message: `テンプレートで使用しているため削除できません`,
            });
        }
        yield before.destroy({
            force: true,
        });
        socketIO_1.IOEmit.emitEvent("cms-theme", "deleted", Number(id), {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`theme: ${before.name}を削除が成功しました`, req);
        res.send({
            message: "削除が成功しました",
        });
    }
    catch (error) {
        console.log(error);
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=theme.js.map