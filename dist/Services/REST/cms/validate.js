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
const utils_1 = require("../../../utils");
const Middlewares_1 = require("../../Middlewares");
exports.route = express_1.default.Router();
exports.route.post("/", (0, express_validator_1.body)("html").isString().exists(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, ({ body: { html } }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rs = yield (0, utils_1.validateHTML)(html);
        const errList = rs.filter((v) => v.type === "error" &&
            !v.message.match(/<!DOCTYPE html>/g) &&
            !v.message.match(/Element “style” not allowed/g) &&
            !v.message.match(/“head”/g));
        res.send({
            errList,
            message: errList.length > 0
                ? "ソースコードをチェックされてエラー一覧を確認してください"
                : "ソースコードをチェックされて問題がありません",
        });
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
//# sourceMappingURL=validate.js.map