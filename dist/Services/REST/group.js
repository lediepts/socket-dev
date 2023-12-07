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
const Group_1 = require("../../Models/Group");
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
const Middlewares_1 = require("../Middlewares");
const Account_1 = require("../../Models/Account");
const sequelize_1 = require("sequelize");
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
        const groups = yield Group_1.GroupSchema.findAll({
            where: {
                status: "active",
            },
            include: [
                {
                    model: Account_1.AccountSchema,
                    required: false,
                    where: {
                        status: {
                            [sequelize_1.Op.ne]: "deleted",
                        },
                    },
                    attributes: [
                        "id",
                        "groupId",
                        "type",
                        "name",
                        "email",
                        "blockedAt",
                        "status",
                    ],
                },
            ],
            order: [
                ["id", "ASC"],
                ["accounts", "id", "ASC"],
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        (0, accessLogs_1.successLogger)("get all success", req);
        res.send({
            groups,
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
        if (!loginInfo) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const group = yield Group_1.GroupSchema.findOne({
            where: {
                id,
                status: "active",
            },
            include: [
                {
                    model: Account_1.AccountSchema,
                    required: false,
                    where: {
                        status: {
                            [sequelize_1.Op.ne]: "deleted",
                        },
                    },
                    attributes: [
                        "id",
                        "groupId",
                        "type",
                        "name",
                        "email",
                        "blockedAt",
                        "status",
                    ],
                },
            ],
            order: [[{ model: Account_1.AccountSchema, as: "accounts" }, "id", "DESC"]],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        (0, accessLogs_1.successLogger)("get one success", req);
        res.send({
            group,
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
exports.route.post("/", (0, express_validator_1.body)("name").isString().notEmpty(), (0, express_validator_1.body)("permission").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, body: { name, permission, description }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[4] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Group_1.GroupSchema.findOne({
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
        const { id } = yield Group_1.GroupSchema.create({
            name,
            permission,
            description,
        });
        socketIO_1.IOEmit.emitEvent("group", "created", id, {
            groupId: id,
            perIndex: 4,
        });
        (0, accessLogs_1.successLogger)(`groupID: ${id}を作成が成功しました`, req);
        res.send({
            id,
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
exports.route.put("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, body: { name, permission, description }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[4] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Group_1.GroupSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield before.update({
            name,
            permission,
            description,
        });
        socketIO_1.IOEmit.emitEvent("group", "updated", before.id, {
            groupId: before.id,
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
exports.route.delete("/:id", (0, express_validator_1.param)("id").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, params: { id }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[4] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const group = yield Group_1.GroupSchema.findByPk(id);
        if (!group) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const accounts = yield Account_1.AccountSchema.findAll({
            where: {
                groupId: id,
                status: { [sequelize_1.Op.ne]: "deleted" },
            },
        });
        yield Promise.all(accounts.map((account) => __awaiter(void 0, void 0, void 0, function* () {
            yield account.update({ status: "deleted" });
            socketIO_1.IOEmit.emitEvent("group", "updated", account.groupId, {
                groupId: account.groupId,
                perIndex: 4,
            });
        })));
        yield group.update({ status: "deleted" });
        socketIO_1.IOEmit.emitEvent("group", "deleted", group.id, {
            groupId: group.id,
            perIndex: 4,
        });
        (0, accessLogs_1.successLogger)(`groupID: ${id}を削除が成功しました`, req);
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
//# sourceMappingURL=group.js.map