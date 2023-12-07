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
const ENV_1 = require("../../Models/ENV");
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
exports.route = express_1.default.Router();
exports.route.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo } = req;
    try {
        const envs = yield ENV_1.ENVSchema.findAll();
        const initialValue = {};
        const config = envs
            .map((v) => v.toJSON())
            .reduce((p, c) => {
            p[c.key] = c.value;
            return p;
        }, initialValue);
        (0, accessLogs_1.successLogger)("システム設定環境変数を取得できました", req);
        res.send({
            config,
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("config ゲット出来なかったです。", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, body } = req;
    try {
        if (!loginInfo || loginInfo.permissions[6] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        for (const key of Object.keys(body)) {
            let value = body[key];
            switch (key) {
                case "blockTime":
                    value = `${parseInt(body[key]) * 1000 * 60 * 60}`;
                    break;
                case "requireUpdatePassTime":
                    value = `${parseInt(body[key]) * 1000 * 60 * 60 * 24}`;
                    break;
                case "signinAge":
                    value = `${parseInt(body[key]) * 1000 * 60 * 60}`;
                    break;
                case "cookieMaxAge":
                    value = `${parseInt(body[key]) * 1000 * 60 * 60}`;
                    break;
                default:
                    break;
            }
            yield ENV_1.ENVSchema.update({
                value,
            }, {
                where: {
                    key,
                },
            });
        }
        socketIO_1.IOEmit.emitEvent("config", "async", 0);
        (0, accessLogs_1.successLogger)(`configを編集が成功しました`, req);
        res.send({
            message: "編集が成功しました",
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("setConfig 出来なかったです。", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=config.js.map