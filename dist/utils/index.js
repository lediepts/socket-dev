"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.validateHTML = exports.createOTPAuth = exports.generateRandomBase32 = exports.idPassLogin = exports.passwordCompare = exports.passwordHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Domain_1 = require("../Models/Domain");
const Account_1 = require("../Models/Account");
const PasswordHistory_1 = require("../Models/PasswordHistory");
const crypto_1 = __importDefault(require("crypto"));
const hi_base32_1 = require("hi-base32");
const OTPAuth = __importStar(require("otpauth"));
const Group_1 = require("../Models/Group");
const axios_1 = __importDefault(require("axios"));
function passwordHash(pass) {
    return bcrypt_1.default.hashSync(pass, 10);
}
exports.passwordHash = passwordHash;
function passwordCompare(hashPass1, hashPass2) {
    return bcrypt_1.default.compareSync(hashPass1, hashPass2);
}
exports.passwordCompare = passwordCompare;
function idPassLogin(email, password, env) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const domain = yield Domain_1.DomainSchema.findOne({
            where: {
                name: email.split("@").pop(),
            },
        });
        if (!domain) {
            return undefined;
        }
        const account = yield Account_1.AccountSchema.findOne({
            where: {
                type: "Default",
                email,
                status: "active",
            },
            include: [
                {
                    model: PasswordHistory_1.PasswordHistorySchema,
                    attributes: ["password"],
                },
                {
                    model: Group_1.GroupSchema,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            order: [[PasswordHistory_1.PasswordHistorySchema, "id", "desc"]],
        });
        if (!account) {
            return undefined;
        }
        const match = passwordCompare(password, account.password);
        if (!match) {
            const fallCount = account.fallCount + 1;
            const fallMax = ((_a = env.find((f) => f.key === "fallMax")) === null || _a === void 0 ? void 0 : _a.value) || "3";
            if (fallCount < Number(fallMax)) {
                yield account.update({
                    fallCount,
                });
            }
            else {
                yield account.update({
                    fallCount,
                    blockedAt: new Date().getTime(),
                    status: "disabled",
                });
            }
            return undefined;
        }
        const blockTime = ((_b = env.find((f) => f.key === "blockTime")) === null || _b === void 0 ? void 0 : _b.value) || "3600000";
        if (account.blockedAt + Number(blockTime) > new Date().getTime()) {
            return undefined;
        }
        else {
            yield account.update({
                status: "active",
            });
        }
        return account;
    });
}
exports.idPassLogin = idPassLogin;
const generateRandomBase32 = () => {
    const buffer = crypto_1.default.randomBytes(15);
    const base32 = (0, hi_base32_1.encode)(buffer).replace(/=/g, "").substring(0, 24);
    return base32;
};
exports.generateRandomBase32 = generateRandomBase32;
const createOTPAuth = (email, otpSecret) => {
    const otpauth = new OTPAuth.TOTP({
        issuer: "CAA",
        label: email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: otpSecret,
    });
    return otpauth;
};
exports.createOTPAuth = createOTPAuth;
function validateHTML(html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: { messages }, } = yield axios_1.default.post("https://validator.w3.org/nu/?out=json", html, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                },
            });
            return messages;
        }
        catch (error) {
            console.error("Validation request failed:", error);
            throw error;
        }
    });
}
exports.validateHTML = validateHTML;
//# sourceMappingURL=index.js.map