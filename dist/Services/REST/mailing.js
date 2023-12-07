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
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
const Middlewares_1 = require("../Middlewares");
const Mailing_1 = require("../../Models/Mailing");
const MailMember_1 = require("../../Models/MailMember");
exports.route = express_1.default.Router();
exports.route.get("/", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo } = req;
        if (!loginInfo) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const mailingAll = yield Mailing_1.MailingSchema.findAll({
            where: {},
            include: [
                {
                    model: MailMember_1.MailMemberSchema,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            order: [
                ["id", "ASC"],
                ["mailMembers", "id", "DESC"],
            ],
        });
        const fixedGroups = mailingAll.filter((f) => loginInfo.permissions[3] >= 1 ||
            f.allowGroup.includes(loginInfo.groupId));
        (0, accessLogs_1.successLogger)("mailings get all success", req);
        res.send({
            mailings: fixedGroups,
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
    const { loginInfo, params: { id }, } = req;
    try {
        const mailing = yield Mailing_1.MailingSchema.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: MailMember_1.MailMemberSchema,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            order: [
                ["id", "ASC"],
                ["mailMembers", "id", "DESC"],
            ],
        });
        if (!mailing) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        if (!loginInfo ||
            !(loginInfo.permissions[3] > 1 ||
                mailing.allowGroup.includes(loginInfo.groupId))) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        (0, accessLogs_1.successLogger)("mailing get one success", req);
        res.send({
            mailing,
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
exports.route.post("/", (0, express_validator_1.body)("name").isString().notEmpty(), (0, express_validator_1.body)("type").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, body: { name, type }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[3] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Mailing_1.MailingSchema.findOne({
            where: {
                name,
            },
        });
        if (before) {
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const { id } = yield Mailing_1.MailingSchema.create({
            name,
            type,
        });
        socketIO_1.IOEmit.emitEvent("mail-group", "created", id, {
            perIndex: 3,
        });
        (0, accessLogs_1.successLogger)(`${name}のメーリングを作成しました`, req);
        res.send({
            id,
            message: `${name}のメーリングを作成しました`,
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
exports.route.post("/:id/member", (0, express_validator_1.param)("id").isString().notEmpty(), (0, express_validator_1.body)("email").isString().isEmail().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, body: { email }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[3] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Mailing_1.MailingSchema.findOne({
            where: {
                id,
            },
        });
        if (!before) {
            (0, accessLogs_1.warningLogger)("メールグループが存在ありません", req);
            return res.send({
                error: true,
                message: `メールグループが存在ありません`,
            });
        }
        const isExists = yield MailMember_1.MailMemberSchema.findOne({
            where: {
                groupId: before.id,
                email,
            },
        });
        if (isExists) {
            (0, accessLogs_1.warningLogger)("メールアドレスは既に登録済みです", req);
            return res.send({
                error: true,
                message: `メールアドレスは既に登録済みです`,
            });
        }
        yield MailMember_1.MailMemberSchema.create({
            groupId: before.id,
            email,
        });
        socketIO_1.IOEmit.emitEvent("mail-group", "updated", before.id, {
            perIndex: 3,
        });
        (0, accessLogs_1.successLogger)(`${before.name}に${email}を追加しました`, req);
        res.send({
            id,
            message: "追加しました",
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
exports.route.put("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, body: { name, allowGroup }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[3] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Mailing_1.MailingSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        if (name) {
            const isUseName = yield Mailing_1.MailingSchema.findOne({
                where: {
                    name,
                },
            });
            if (isUseName) {
                (0, accessLogs_1.warningLogger)("メールグループ名は存在あるので別の名前を設定してください", req);
                return res.send({
                    error: true,
                    message: `メールグループ名は存在あるので別の名前を設定してください`,
                });
            }
        }
        yield before.update({
            name,
            allowGroup,
        });
        socketIO_1.IOEmit.emitEvent("mail-group", "updated", before.id, {
            perIndex: 3,
        });
        (0, accessLogs_1.successLogger)(`${name || before.name}のメーリングを編集が成功しました`, req);
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
exports.route.delete("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, query: { force }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[3] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Mailing_1.MailingSchema.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: MailMember_1.MailMemberSchema,
                },
            ],
        });
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        if (force) {
            for (const member of before.mailMembers) {
                yield Mailing_1.MailingSchema.destroy({
                    where: {
                        id: member.id,
                    },
                });
            }
        }
        yield before.destroy();
        socketIO_1.IOEmit.emitEvent("mail-group", "deleted", before.id, {
            perIndex: 3,
        });
        (0, accessLogs_1.successLogger)(`${before.name}を削除が成功しました`, req);
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
exports.route.delete("/:id/:memberId", (0, express_validator_1.param)("id").isString().notEmpty(), (0, express_validator_1.param)("memberId").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id, memberId }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[3] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const groupMail = yield Mailing_1.MailingSchema.findByPk(id);
        if (!groupMail) {
            (0, accessLogs_1.warningLogger)("メールグループが存在ありません", req);
            return res.send({
                error: true,
                message: `メールグループが存在ありません`,
            });
        }
        const member = yield MailMember_1.MailMemberSchema.findByPk(memberId);
        if (!member) {
            (0, accessLogs_1.warningLogger)("メールが存在ありません", req);
            return res.send({
                error: true,
                message: `メールが存在ありません`,
            });
        }
        yield member.destroy();
        socketIO_1.IOEmit.emitEvent("mail-group", "updated", groupMail.id, {
            perIndex: 3,
        });
        (0, accessLogs_1.successLogger)(`${groupMail.name}から${member.email}を削除しました`, req);
        res.send({
            id: member.id,
            message: `${member.email}を削除しました`,
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
//# sourceMappingURL=mailing.js.map