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
const Workflow_1 = require("../../Models/Workflow");
const Page_1 = require("../../Models/Page");
const WebAuthor_1 = require("../../Models/WebAuthor");
const accessLogs_1 = require("../../accessLogs");
const socketIO_1 = require("../../socketIO");
const Middlewares_1 = require("../Middlewares");
exports.route = express_1.default.Router();
exports.route.get("/", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo } = req;
    try {
        if (!loginInfo || !loginInfo.workflow) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const workflows = yield Workflow_1.WorkflowSchema.findAll({
            include: [
                {
                    model: WebAuthor_1.WebAuthorSchema,
                    include: [
                        {
                            model: Account_1.AccountSchema,
                        },
                    ],
                },
                {
                    model: Page_1.PageSchema,
                },
            ],
        });
        (0, accessLogs_1.successLogger)("get workflows success", req);
        res.send({
            workflows,
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
        if (!loginInfo || !loginInfo.workflow) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const workflow = yield Workflow_1.WorkflowSchema.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: WebAuthor_1.WebAuthorSchema,
                    include: [
                        {
                            model: Account_1.AccountSchema,
                        },
                    ],
                },
                {
                    model: Page_1.PageSchema,
                },
            ],
        });
        (0, accessLogs_1.successLogger)("get workflow success", req);
        res.send({
            workflow,
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
exports.route.post("/", (0, express_validator_1.body)("authorizer").isNumeric().notEmpty(), (0, express_validator_1.body)("pageId").isNumeric().notEmpty(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginInfo, body: { authorizer, pageId, hopeTime }, } = req;
    try {
        if (!loginInfo || loginInfo.permissions[0] < 2) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const authorizerModel = yield WebAuthor_1.WebAuthorSchema.findByPk(authorizer);
        if (!authorizerModel) {
            (0, accessLogs_1.warningLogger)("authorizer存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        const pageModel = yield Page_1.PageSchema.findByPk(pageId);
        if (!pageModel) {
            (0, accessLogs_1.warningLogger)("pageId存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield Workflow_1.WorkflowSchema.create({
            authorizer,
            pageId,
            sender: loginInfo.id,
            hopeTime,
        });
        socketIO_1.IOEmit.emitEvent("workflow", "created", authorizerModel.email);
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=workflow.js.map