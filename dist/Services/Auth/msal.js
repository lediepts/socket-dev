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
const jsonwebtoken_1 = require("jsonwebtoken");
const Account_1 = require("../../Models/Account");
const Domain_1 = require("../../Models/Domain");
const Group_1 = require("../../Models/Group");
const Middlewares_1 = require("../Middlewares");
const WebAuthorUser_1 = require("../../Models/WebAuthorUser");
const WebAuthor_1 = require("../../Models/WebAuthor");
exports.route = express_1.default.Router();
exports.route.get("/", ({}, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, jsonwebtoken_1.sign)({ info: "funny!" }, Middlewares_1.AUTH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: 1000 * 60,
    });
    res.cookie("__csrf", token, {
        maxAge: 1000 * 60,
        httpOnly: true,
        secure: false,
        signed: true,
    });
    res.sendStatus(202);
}));
exports.route.post("/", (0, express_validator_1.body)("email").isString().notEmpty().isEmail(), (0, express_validator_1.body)("name").isString().notEmpty(), Middlewares_1.validatorsMiddleware, ({ body: { email, name }, signedCookies: { __csrf }, }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        try {
            const check = (0, jsonwebtoken_1.verify)(String(__csrf), Middlewares_1.AUTH_TOKEN_SECRET);
            if (!check)
                throw undefined;
        }
        catch (error) {
            console.log(error);
            return res.send({
                error: true,
                message: `ログイン失敗しました。`,
            });
        }
        res.clearCookie("__csrf");
        const domain = yield Domain_1.DomainSchema.findOne({
            where: {
                name: email.split("@").pop(),
            },
        });
        if (!domain) {
            return res.send({
                error: true,
                message: `ログイン失敗しました。`,
            });
        }
        const account = yield Account_1.AccountSchema.findOne({
            where: {
                type: "MSAL",
                email,
                status: "active",
            },
            include: [
                {
                    model: Group_1.GroupSchema,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
        });
        if (!account) {
            return res.send({
                error: true,
                message: `ログイン失敗しました。`,
            });
        }
        if (account.name !== name) {
            yield account.update({
                name,
            });
        }
        const webAuthorUser = yield WebAuthorUser_1.WebAuthorUserSchema.findOne({
            where: {
                accountId: account.id,
            },
        });
        const webAuthor = yield WebAuthor_1.WebAuthorSchema.findByPk(webAuthorUser === null || webAuthorUser === void 0 ? void 0 : webAuthorUser.toJSON().webAuthorId);
        const tokenInfo = {
            id: account.id,
            name: account.name,
            email: account.email,
            groupId: account.group.id,
            groupName: account.group.name,
            type: "Default",
            permissions: account.group.permission,
            workflow: webAuthor
                ? {
                    email: webAuthor.email,
                    admin: webAuthor.admin,
                }
                : undefined,
        };
        yield (0, Middlewares_1.setAuthCookie)(tokenInfo, res);
        res.send({ tokenInfo });
    }
    catch (error) {
        console.log(error);
        res.clearCookie("__csrf");
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=msal.js.map