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
const Mailing_1 = require("../../Models/Mailing");
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
const Middlewares_1 = require("../Middlewares");
const SendMailHistory_1 = require("../../Models/SendMailHistory");
const BearMail_1 = require("../../utils/BearMail");
const MailMember_1 = require("../../Models/MailMember");
const Group_1 = require("../../Models/Group");
const Account_1 = require("../../Models/Account");
exports.route = express_1.default.Router();
exports.route.get("/history", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo } = req;
        if (!loginInfo) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const groups = yield Group_1.GroupSchema.findAll();
        const users = yield Account_1.AccountSchema.findAll();
        const mailings = yield Mailing_1.MailingSchema.findAll();
        const histories = yield SendMailHistory_1.SendMailHistorySchema.findAll({
            where: loginInfo.permissions[2] > 1
                ? {}
                : {
                    organization: loginInfo.groupId,
                },
            limit: 20,
            order: [["id", "DESC"]],
        });
        (0, accessLogs_1.successLogger)("histories get all success", req);
        res.send({
            histories: histories.map((v) => {
                var _a, _b, _c;
                const data = v.toJSON();
                return Object.assign(Object.assign({}, data), { sender: (_a = users.find((f) => f.id === data.sender)) === null || _a === void 0 ? void 0 : _a.name, organization: (_b = groups.find((f) => f.id === data.organization)) === null || _b === void 0 ? void 0 : _b.name, mailing: (_c = mailings.find((f) => f.id === data.mailingId)) === null || _c === void 0 ? void 0 : _c.name });
            }),
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
exports.route.post("/send", (0, express_validator_1.body)("mailingIds").isArray({ min: 1 }), (0, express_validator_1.body)("subject").isString().notEmpty(), (0, express_validator_1.body)("html").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, body: { subject, html, mailingIds }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[3] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        for (const mailingId of mailingIds) {
            const ml = yield Mailing_1.MailingSchema.findOne({
                where: {
                    id: mailingId,
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
            if (!ml)
                continue;
            try {
                yield BearMail_1.BearMail.send({
                    mailingId,
                    subject,
                    html,
                    sender: loginInfo.id,
                    organization: loginInfo.groupId,
                    mailing: ml.toJSON().mailMembers.map((v) => v.email),
                });
                res.send({
                    message: "送信完了しました",
                });
            }
            catch (error) {
                console.log(error);
                (0, accessLogs_1.errorLogger)("送信失敗しました", req);
                res.send({
                    error: true,
                    message: "送信失敗しました",
                });
            }
            socketIO_1.IOEmit.emitEvent("mail-history", "async", 0, {
                perIndex: 2,
            });
        }
    }
    catch (error) {
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=mail.js.map