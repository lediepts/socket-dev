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
const Domain_1 = require("../../Models/Domain");
const express_validator_1 = require("express-validator");
const Middlewares_1 = require("../Middlewares");
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
exports.route = express_1.default.Router();
exports.route.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const domains = yield Domain_1.DomainSchema.findAll();
        (0, accessLogs_1.successLogger)("get all success", req);
        res.send({
            domains,
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
exports.route.post("/", (0, express_validator_1.body)("name").isString().notEmpty(), (0, express_validator_1.body)("displayName").isString().notEmpty(), (0, express_validator_1.body)("clientId").isString().notEmpty(), (0, express_validator_1.body)("tenantId").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, loginInfo } = req;
    try {
        if (!loginInfo || loginInfo.permissions[6] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Domain_1.DomainSchema.findOne({
            where: {
                name: body.name
            },
        });
        if (before) {
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const { id } = yield Domain_1.DomainSchema.create(body);
        socketIO_1.IOEmit.emitEvent("domain", "created", id);
        (0, accessLogs_1.successLogger)(`Domain: ${body.name}を作成が成功しました`, req);
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
exports.route.put("/:id", Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, body, loginInfo, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[6] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Domain_1.DomainSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield before.update(body);
        socketIO_1.IOEmit.emitEvent("domain", "updated", before.id);
        (0, accessLogs_1.successLogger)(`ドメイン${express_validator_1.param.name || before.name}を変更完了しました`, req);
        res.send({
            id,
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
        if (!loginInfo || loginInfo.permissions[6] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Domain_1.DomainSchema.findByPk(id);
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
        socketIO_1.IOEmit.emitEvent("domain", "deleted", Number(id));
        (0, accessLogs_1.successLogger)(`domain: ${before.name}を削除が成功しました`, req);
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
//# sourceMappingURL=domain.js.map