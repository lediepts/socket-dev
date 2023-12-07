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
const Web_1 = require("../../../Models/Web");
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
        const webs = yield Web_1.WebSchema.findAll({});
        (0, accessLogs_1.successLogger)("get all success", req);
        res.send({
            webs,
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
        const web = yield Web_1.WebSchema.findByPk(id);
        (0, accessLogs_1.successLogger)("get one success", req);
        res.send({
            web,
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
exports.route.post("/", (0, express_validator_1.body)("name").isString().notEmpty(), (0, express_validator_1.body)("favicon").isString().notEmpty(), (0, express_validator_1.body)("ogURL").isString().notEmpty(), (0, express_validator_1.body)("ogImage").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, body: { name, ogDescription, ogImage, ogURL, favicon }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Web_1.WebSchema.findOne({ where: { name } });
        if (before) {
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const rs = yield Web_1.WebSchema.create({
            name,
            ogDescription,
            ogImage,
            ogURL,
            favicon,
        });
        socketIO_1.IOEmit.emitEvent("cms-web", "created", rs.id, {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`web: ${name}を作成が成功しました`, req);
        res.send({
            id: rs.id,
            message: "作成が成功しました",
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
exports.route.put("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, params: { id }, body: { name, ogDescription, ogImage, ogURL, favicon }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Web_1.WebSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield before.update({
            name,
            ogDescription,
            ogImage,
            ogURL,
            favicon,
        });
        socketIO_1.IOEmit.emitEvent("cms-web", "updated", Number(id), {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`web: ${name || before.name}を編集が成功しました`, req);
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
        if (!loginInfo || loginInfo.permissions[0] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Web_1.WebSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield before.destroy({
            force: true,
        });
        socketIO_1.IOEmit.emitEvent("cms-web", "deleted", Number(id), {
            perIndex: 0,
        });
        (0, accessLogs_1.successLogger)(`Web: ${before.name}を削除が成功しました`, req);
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
//# sourceMappingURL=web.js.map