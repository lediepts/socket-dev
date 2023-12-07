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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.cookieMiddleware = exports.clearCookie = exports.setAuthCookie = exports.verifyToken = exports.createToken = exports.validatorsMiddleware = exports.AUTH_TOKEN_SECRET = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const ENV_1 = require("../../Models/ENV");
exports.AUTH_TOKEN_SECRET = "7354c727be6012b928e95b1103850da68168b55ef0cc41ee45d6a05be642af66f2062300";
function validatorsMiddleware(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    const errs = errors.mapped();
    if (!errors.isEmpty()) {
        res.send({
            error: true,
            message: Object.keys(errs)
                .map((k) => `${k}:${errs[k].msg}`)
                .join(";"),
        });
    }
    else
        next();
}
exports.validatorsMiddleware = validatorsMiddleware;
const createToken = (tokenInfo) => {
    try {
        return (0, jsonwebtoken_1.sign)(Object.assign({}, tokenInfo), exports.AUTH_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "30d",
        });
    }
    catch (error) {
        console.log(error);
        return undefined;
    }
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        if (!token)
            throw {
                message: "token is null",
            };
        const info = (0, jsonwebtoken_1.verify)(token, exports.AUTH_TOKEN_SECRET);
        return info;
    }
    catch (error) {
        return undefined;
    }
};
exports.verifyToken = verifyToken;
const cookieName = "__caa";
function setAuthCookie(info, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const env = yield ENV_1.ENVSchema.findAll();
        const cookieMaxAge = ((_a = env.find((f) => f.key === "cookieMaxAge")) === null || _a === void 0 ? void 0 : _a.value) || "3600000";
        const token = (0, exports.createToken)(info);
        res.cookie(cookieName, token, {
            maxAge: Number(cookieMaxAge),
            httpOnly: true,
            secure: false,
            signed: true,
        });
    });
}
exports.setAuthCookie = setAuthCookie;
function clearCookie(res) {
    res.clearCookie(cookieName);
}
exports.clearCookie = clearCookie;
const cookieMiddleware = (req, res, next) => {
    try {
        const { __caa } = req.signedCookies;
        const tokenInfo = (0, exports.verifyToken)(__caa);
        req.loginInfo = tokenInfo;
        next();
    }
    catch (_a) {
        res.sendStatus(401);
    }
};
exports.cookieMiddleware = cookieMiddleware;
const authMiddleware = (req, res, next) => {
    if (req.loginInfo) {
        next();
    }
    else {
        res.send({
            error: true,
            message: "権限なし",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=index.js.map