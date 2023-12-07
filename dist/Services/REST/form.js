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
const Form_1 = require("../../Models/Form");
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
const Middlewares_1 = require("../Middlewares");
const Web_1 = require("../../Models/Web");
exports.route = express_1.default.Router();
exports.route.get("/", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo } = req;
        if (!loginInfo || loginInfo.permissions[1] < 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const forms = yield Form_1.FormSchema.findAll({
            where: {},
            include: [{ model: Web_1.WebSchema }],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        (0, accessLogs_1.successLogger)("get all success", req);
        res.send({
            forms: forms.filter((f) => loginInfo.groupId === 1 ||
                loginInfo.permissions[0] > 1 ||
                f.owner === loginInfo.groupId),
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
        if (!loginInfo || loginInfo.permissions[1] < 1) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const form = yield Form_1.FormSchema.findOne({
            where: {
                id,
            },
            include: [{ model: Web_1.WebSchema }],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        (0, accessLogs_1.successLogger)("get one success", req);
        res.send({
            form: loginInfo.groupId === 1 ||
                loginInfo.permissions[0] > 1 ||
                (form === null || form === void 0 ? void 0 : form.owner) === loginInfo.groupId
                ? form
                : undefined,
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
exports.route.post("/", (0, express_validator_1.body)("webId").isNumeric().exists(), (0, express_validator_1.body)("name").isString().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, body: { name, webId, endDate, startDate }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[1] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Form_1.FormSchema.findOne({
            where: {
                name,
                webId,
            },
        });
        if (before) {
            (0, accessLogs_1.warningLogger)("既に存在します", req);
            return res.send({
                error: true,
                message: `既に存在します`,
            });
        }
        const { id } = yield Form_1.FormSchema.create({
            name,
            webId,
            content: "",
            endDate,
            startDate,
            status: "created",
            owner: loginInfo.groupId,
        });
        socketIO_1.IOEmit.emitEvent("form", "created", id, {
            perIndex: 0,
            groupId: loginInfo.groupId,
        });
        (0, accessLogs_1.successLogger)(`formID: ${id}を作成が成功しました`, req);
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
    const { loginInfo, params: { id }, body: { name, webId, content, status, startDate, endDate }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[1] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const before = yield Form_1.FormSchema.findByPk(id);
        if (!before) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const sd = startDate || before.startDate || new Date("1971/01/01");
        const ed = endDate || before.endDate || new Date("2100/01/01");
        if (endDate && before.endDate && new Date(endDate) < new Date(sd)) {
            (0, accessLogs_1.warningLogger)("end date is invalid", req);
            return res.send({
                error: true,
                message: `end date is invalid`,
            });
        }
        if (startDate && before.startDate && new Date(startDate) > new Date(ed)) {
            (0, accessLogs_1.warningLogger)("start date is invalid", req);
            return res.send({
                error: true,
                message: `start date is invalid`,
            });
        }
        if (name) {
            const isNameExist = yield Form_1.FormSchema.findOne({
                where: { webId: before.webId, name },
            });
            if (isNameExist) {
                (0, accessLogs_1.warningLogger)("名前が存在していません", req);
                return res.send({
                    error: true,
                    message: `名前が存在していません`,
                });
            }
        }
        yield before.update({
            name,
            content,
            webId,
            status,
            startDate,
            endDate,
        });
        socketIO_1.IOEmit.emitEvent("form", "updated", before.id, {
            perIndex: 0,
            groupId: loginInfo.groupId,
        });
        (0, accessLogs_1.successLogger)(`formID: ${id}を編集が成功しました`, req);
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
        if (!loginInfo || loginInfo.permissions[1] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const form = yield Form_1.FormSchema.findByPk(id);
        if (!form) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield form.destroy();
        socketIO_1.IOEmit.emitEvent("form", "deleted", form.id, {
            perIndex: 0,
            groupId: loginInfo.groupId,
        });
        (0, accessLogs_1.successLogger)(`formID: ${id}を削除が成功しました`, req);
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
//# sourceMappingURL=form.js.map