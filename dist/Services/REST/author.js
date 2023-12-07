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
const Account_1 = require("../../Models/Account");
const WebAuthor_1 = require("../../Models/WebAuthor");
const WebAuthorUser_1 = require("../../Models/WebAuthorUser");
const accessLogs_1 = require("../../accessLogs");
const database_1 = __importDefault(require("../../database"));
const socketIO_1 = require("../../socketIO");
const Middlewares_1 = require("../Middlewares");
exports.route = express_1.default.Router();
exports.route.get("/", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webAuthors = yield WebAuthor_1.WebAuthorSchema.findAll({
            include: [
                {
                    model: Account_1.AccountSchema,
                },
            ],
        });
        (0, accessLogs_1.successLogger)("get webAuthors success", req);
        res.send({
            webAuthors,
        });
    }
    catch (error) {
        console.log("server/src/Services/REST/author.ts:28>>", error);
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.get("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, } = req;
    try {
        const webAuthor = yield WebAuthor_1.WebAuthorSchema.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Account_1.AccountSchema,
                },
            ],
        });
        (0, accessLogs_1.successLogger)("get webAuthor success", req);
        res.send({
            webAuthor,
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
exports.route.post("/", (0, express_validator_1.body)("email").isString().notEmpty().isEmail(), (0, express_validator_1.body)("userIds").isArray(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { email, userIds }, loginInfo, } = req;
    const t = yield database_1.default.transaction();
    try {
        if (!loginInfo || loginInfo.groupId !== 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield WebAuthor_1.WebAuthorSchema.findOne({
            where: {
                email,
            },
        });
        if (before) {
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const { id } = yield WebAuthor_1.WebAuthorSchema.create({
            email,
        });
        for (const accountId of userIds) {
            yield WebAuthorUser_1.WebAuthorUserSchema.create({
                accountId,
                webAuthorId: id,
            });
        }
        yield t.commit();
        socketIO_1.IOEmit.emitEvent("author", "created", id);
        (0, accessLogs_1.successLogger)(`承認可能一覧に${email}を追加しました`, req);
        res.send({
            id,
            message: `承認可能一覧に${email}を追加しました`,
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
exports.route.put("/", Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { email, userIds }, loginInfo, } = req;
    const t = yield database_1.default.transaction();
    try {
        if (!loginInfo || loginInfo.groupId !== 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const emailModel = yield WebAuthor_1.WebAuthorSchema.findOne({
            where: {
                email,
            },
            include: Account_1.AccountSchema,
        });
        if (!emailModel) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const accounts = emailModel.accounts;
        for (const acc of accounts.filter((f) => !userIds.find((id) => id === f.id))) {
            yield WebAuthorUser_1.WebAuthorUserSchema.destroy({
                where: {
                    accountId: acc.id,
                    webAuthorId: emailModel.id,
                },
            });
        }
        for (const accountId of userIds) {
            yield WebAuthorUser_1.WebAuthorUserSchema.findOrCreate({
                where: {
                    accountId,
                    webAuthorId: emailModel.id,
                },
                defaults: {
                    accountId,
                    webAuthorId: emailModel.id,
                },
            });
        }
        yield t.commit();
        socketIO_1.IOEmit.emitEvent("author", "updated", emailModel.id);
        (0, accessLogs_1.successLogger)(`承認${email}にユーザ連携編集しました`, req);
        res.send({
            message: `承認${email}にユーザ連携編集しました`,
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
exports.route.delete("/:email", (0, express_validator_1.param)("email").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { email }, loginInfo, } = req;
    const t = yield database_1.default.transaction();
    try {
        if (!loginInfo || loginInfo.groupId !== 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const emailModel = yield WebAuthor_1.WebAuthorSchema.findOne({
            where: {
                email,
            },
            include: Account_1.AccountSchema,
        });
        if (!emailModel) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const accounts = emailModel.accounts;
        for (const account of accounts) {
            yield WebAuthorUser_1.WebAuthorUserSchema.destroy({
                where: {
                    accountId: account.id,
                    webAuthorId: emailModel.id,
                },
            });
        }
        yield emailModel.destroy();
        yield t.commit();
        socketIO_1.IOEmit.emitEvent("author", "deleted", emailModel.id);
        (0, accessLogs_1.successLogger)(`承認${email}削除しました`, req);
        res.send({
            message: `承認${email}削除しました`,
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
//# sourceMappingURL=author.js.map