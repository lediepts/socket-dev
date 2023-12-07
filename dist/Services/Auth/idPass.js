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
const ENV_1 = require("../../Models/ENV");
const PasswordHistory_1 = require("../../Models/PasswordHistory");
const utils_1 = require("../../utils");
const Middlewares_1 = require("../Middlewares");
const WebAuthorUser_1 = require("../../Models/WebAuthorUser");
const WebAuthor_1 = require("../../Models/WebAuthor");
exports.route = express_1.default.Router();
exports.route.post("/", (0, express_validator_1.body)("email").isString().notEmpty().isEmail(), (0, express_validator_1.body)("password").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
}), Middlewares_1.validatorsMiddleware, ({ body: { email, password }, }, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const env = yield ENV_1.ENVSchema.findAll();
        const account = yield (0, utils_1.idPassLogin)(email, password, env);
        if (!account) {
            return res.send({
                error: true,
                message: `ログイン失敗しました。`,
            });
        }
        const requireUpdatePassTime = ((_a = env.find((f) => f.key === "requireUpdatePassTime")) === null || _a === void 0 ? void 0 : _a.value) ||
            "7776000000";
        if (account.updatePasswordAt + Number(requireUpdatePassTime) <=
            new Date().getTime()) {
            return res.send({
                require: "update_password",
            });
        }
        let otpSecret = account.otpSecret;
        if (!otpSecret) {
            otpSecret = (0, utils_1.generateRandomBase32)();
            yield account.update({
                otpSecret,
            });
            const otpauthUrl = (0, utils_1.createOTPAuth)(email, otpSecret).toString();
            return res.send({
                require: "verify_otp",
                otpSecret,
                otpauthUrl,
            });
        }
        else {
            return res.send({
                require: "otp",
                otpSecret,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.patch("/:email", (0, express_validator_1.param)("email").isString().notEmpty().isEmail(), (0, express_validator_1.body)("password").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
}), (0, express_validator_1.body)("newPassword").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
}), Middlewares_1.validatorsMiddleware, ({ params: { email }, body: { password, newPassword }, }, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const env = yield ENV_1.ENVSchema.findAll();
        const account = yield (0, utils_1.idPassLogin)(email, password, env);
        if (!account) {
            return res.send({
                error: true,
                message: `ログイン失敗しました。`,
            });
        }
        const passwordHistoryMax = ((_b = env.find((f) => f.key === "passwordHistoryMax")) === null || _b === void 0 ? void 0 : _b.value) || "3";
        const passHistories = account.passwordHistories
            .map((v) => v.password)
            .splice(0, Number(passwordHistoryMax) - 1);
        let hpMatch = false;
        for (const oldPass of passHistories) {
            if ((0, utils_1.passwordCompare)(newPassword, oldPass)) {
                hpMatch = true;
                break;
            }
        }
        if (hpMatch) {
            return res.send({
                error: true,
                message: `過去${passwordHistoryMax}回までに使用したパスワードは使用できません`,
            });
        }
        yield PasswordHistory_1.PasswordHistorySchema.create({
            accountId: account.id,
            password: account.password,
        });
        yield account.update({
            updatePasswordAt: new Date().getTime(),
            password: (0, utils_1.passwordHash)(newPassword),
        });
        let otpSecret = account.otpSecret;
        if (!otpSecret) {
            otpSecret = (0, utils_1.generateRandomBase32)();
            yield account.update({
                otpSecret,
            });
            const otpauthUrl = (0, utils_1.createOTPAuth)(email, otpSecret).toString();
            return res.send({
                require: "verify_otp",
                otpSecret,
                otpauthUrl,
            });
        }
        else {
            return res.send({
                require: "otp",
                otpSecret,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.post("/verify/:email", (0, express_validator_1.param)("email").isString().notEmpty().isEmail(), (0, express_validator_1.body)("password").isString().notEmpty().isStrongPassword({
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
}), (0, express_validator_1.body)("otpSecret").exists(), (0, express_validator_1.body)("token").exists(), Middlewares_1.validatorsMiddleware, ({ params: { email }, body: { password, otpSecret, token }, }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const env = yield ENV_1.ENVSchema.findAll();
        const account = yield (0, utils_1.idPassLogin)(email, password, env);
        if (!account || account.otpSecret !== otpSecret) {
            return res.send({
                error: true,
                message: `ログイン失敗しました。`,
            });
        }
        const otpauth = (0, utils_1.createOTPAuth)(email, account.otpSecret);
        const delta = otpauth.validate({ token, window: 1 });
        if (delta === null)
            return res.send({
                error: true,
                message: `ログイン失敗しました。`,
            });
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
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=idPass.js.map