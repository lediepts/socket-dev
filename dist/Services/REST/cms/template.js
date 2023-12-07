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
const Middlewares_1 = require("../../Middlewares");
const accessLogs_1 = require("../../../accessLogs");
const express_validator_1 = require("express-validator");
const socketIO_1 = require("../../../socketIO");
const Template_1 = require("../../../Models/Template");
const Theme_1 = require("../../../Models/Theme");
const database_1 = __importDefault(require("../../../database"));
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
        const templates = yield Template_1.TemplateSchema.findAll({
            where: {},
            include: [
                {
                    model: Theme_1.ThemeSchema,
                },
            ],
            order: [
                ["active", "DESC"],
                ["ver", "DESC"],
            ],
        });
        (0, accessLogs_1.successLogger)("get all success", req);
        res.send({
            templates,
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
        const template = yield Template_1.TemplateSchema.findOne({
            where: { id, active: true },
            include: [
                {
                    model: Theme_1.ThemeSchema,
                },
            ],
        });
        (0, accessLogs_1.successLogger)("get one success", req);
        res.send({
            template,
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
exports.route.post("/", (0, express_validator_1.body)("name").isString().notEmpty(), (0, express_validator_1.body)("themeId").isNumeric(), (0, express_validator_1.body)("body").isObject(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, body: { name, body, themeId }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Template_1.TemplateSchema.findOne({ where: { name } });
        if (before) {
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const rs = yield Template_1.TemplateSchema.create({
            name,
            body,
            themeId,
            owner: loginInfo.groupId,
        });
        socketIO_1.IOEmit.emitEvent("cms-template", "created", rs.id, {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`template: ${name}を作成が成功しました`, req);
        res.send({
            id: rs.id,
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
        const { loginInfo, params: { id }, body: { name, body, subOwner, script, style, formScript, formStyle }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Template_1.TemplateSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield Template_1.TemplateSchema.create(Object.assign(Object.assign({}, before.toJSON()), { active: false, id: undefined }));
        const max = yield Template_1.TemplateSchema.max("ver", {
            where: {
                uuid: before.uuid,
            },
        });
        yield before.update({
            ver: max + 1,
            name,
            body,
            subOwner,
            script,
            style,
            formScript,
            formStyle,
        });
        socketIO_1.IOEmit.emitEvent("cms-template", "async", 0, {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`template: ${name || before.name}を編集が成功しました`, req);
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
exports.route.patch("/:id/active", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield database_1.default.transaction();
    try {
        const { loginInfo, params: { id }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Template_1.TemplateSchema.findByPk(id, {
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const currentActive = yield Template_1.TemplateSchema.findOne({
            where: {
                uuid: before.uuid,
                active: true,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        if (!currentActive) {
            (0, accessLogs_1.warningLogger)("元のレコードが存在していません", req);
            return res.send({
                error: true,
                message: `元のレコードが存在していません`,
            });
        }
        yield Template_1.TemplateSchema.create(Object.assign(Object.assign({}, currentActive.toJSON()), { id: undefined, active: false }));
        const { name } = before.toJSON();
        yield currentActive.update(Object.assign(Object.assign({}, before.toJSON()), { id: undefined, active: true }));
        yield before.destroy({ force: true });
        socketIO_1.IOEmit.emitEvent("cms-template", "async", 0, {
            perIndex: 0,
        });
        yield t.commit();
        (0, accessLogs_1.successLogger)(`Template: ${name}のVersion変更しました`, req);
        res.send({
            message: "Version変更しました",
        });
    }
    catch (error) {
        yield t.rollback();
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
        if (!loginInfo || loginInfo.permissions[0] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Template_1.TemplateSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield before.update({
            name: `${before.name}_${new Date().getTime()}`,
            active: false,
        });
        socketIO_1.IOEmit.emitEvent("cms-template", "deleted", Number(id), {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`Page: ${before.name}を削除が成功しました`, req);
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
//# sourceMappingURL=template.js.map