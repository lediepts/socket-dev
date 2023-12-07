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
exports.authApi = void 0;
const express_1 = __importDefault(require("express"));
const Account_1 = require("../../Models/Account");
const Group_1 = require("../../Models/Group");
const Middlewares_1 = require("../Middlewares");
const idPass_1 = require("./idPass");
const msal_1 = require("./msal");
const WebAuthorUser_1 = require("../../Models/WebAuthorUser");
const WebAuthor_1 = require("../../Models/WebAuthor");
exports.authApi = express_1.default.Router();
exports.authApi.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { __caa } = req.signedCookies;
        const info = (0, Middlewares_1.verifyToken)(__caa);
        if (!info) {
            (0, Middlewares_1.clearCookie)(res);
            return res.send({
                error: true,
            });
        }
        const account = yield Account_1.AccountSchema.findOne({
            where: {
                id: info.id,
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
            (0, Middlewares_1.clearCookie)(res);
            return res.send({ error: true });
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
            type: account.type,
            groupId: account.group.id,
            groupName: account.group.name,
            permissions: account.group.permission,
            workflow: webAuthor ? {
                email: webAuthor.email,
                admin: webAuthor.admin
            } : undefined
        };
        yield (0, Middlewares_1.setAuthCookie)(tokenInfo, res);
        res.send({ tokenInfo });
    }
    catch (error) {
        console.log(error);
        res.send({
            error: true,
        });
    }
}));
exports.authApi.use("/login", idPass_1.route);
exports.authApi.use("/login/msal", msal_1.route);
exports.authApi.post("/logout", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, Middlewares_1.clearCookie)(res);
    res.redirect("/");
}));
exports.authApi.use("/*", (req, res) => {
    res.sendStatus(404);
});
//# sourceMappingURL=index.js.map