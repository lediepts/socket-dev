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
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
const utils_1 = require("../../utils");
const Middlewares_1 = require("../Middlewares");
exports.route = express_1.default.Router();
exports.route.post("/", (0, express_validator_1.body)("type").isString().notEmpty(), (0, express_validator_1.body)("groupId").isNumeric(), (0, express_validator_1.body)("email").isString().isEmail(), (0, express_validator_1.body)("name").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, body: { name, type, groupId, email, password }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[4] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        if (type === "Default" && !password) {
            (0, accessLogs_1.warningLogger)("パスワードが必要です", req);
            return res.send({
                error: true,
                message: `パスワードが必要です`,
            });
        }
        const before = yield Account_1.AccountSchema.findOne({
            where: {
                email,
            },
        });
        if (before) {
            if (before.status === "deleted") {
                (0, accessLogs_1.warningLogger)("削除済みのアカウントです", req);
                return res.send({
                    error: true,
                    message: "削除済みのアカウントです",
                });
            }
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const { id } = yield Account_1.AccountSchema.create({
            name,
            type,
            groupId,
            email,
            password: password ? (0, utils_1.passwordHash)(password) : "",
        });
        socketIO_1.IOEmit.emitEvent("group", "updated", groupId, {
            groupId: id,
            perIndex: 4,
        });
        (0, accessLogs_1.successLogger)(`groupID: ${groupId}にアカウントを追加しました。`, req);
        res.send({
            message: "作成が成功しました",
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
exports.route.put("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, body: { name, action }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[4] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Account_1.AccountSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const status = action || before.status;
        yield before.update({
            name: name || before.name,
            status: loginInfo.id === Number(id) ? undefined : status,
        });
        socketIO_1.IOEmit.emitEvent("group", "updated", before.groupId, {
            groupId: before.groupId,
            perIndex: 4,
        });
        (0, accessLogs_1.successLogger)(`groupID: ${id}を編集が成功しました`, req);
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
exports.route.patch("/:id/change-group", (0, express_validator_1.param)("id").isString().notEmpty(), (0, express_validator_1.body)("groupId").isNumeric().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, body: { groupId }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[4] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const account = yield Account_1.AccountSchema.findByPk(id);
        if (!account) {
            (0, accessLogs_1.warningLogger)("アカウントが存在しません", req);
            return res.send({
                error: true,
                message: "アカウントが存在しません",
            });
        }
        const oldGroupID = account.groupId;
        yield account.update({
            groupId,
        });
        socketIO_1.IOEmit.emitEvent("group", "updated", groupId, {
            perIndex: 4,
            groupId,
        });
        socketIO_1.IOEmit.emitEvent("group", "updated", oldGroupID, {
            perIndex: 4,
            groupId: oldGroupID,
        });
        socketIO_1.IOEmit.emitEvent("account", "async", parseInt(id));
        (0, accessLogs_1.successLogger)(`アカウントの所属グループを変更しました`, req);
        res.send({
            message: "所属グループを変更しました",
        });
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("エラーが発生しました", req);
        res.send({
            error: true,
            message: "エラーが発生しました",
        });
    }
}));
//# sourceMappingURL=account.js.map