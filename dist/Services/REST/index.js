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
exports.restApi = void 0;
const express_1 = __importDefault(require("express"));
const domain_1 = require("./domain");
const account_1 = require("./account");
const config_1 = require("./config");
const group_1 = require("./group");
const form_1 = require("./form");
const local_1 = require("./local");
const cms_1 = require("./cms");
const mailing_1 = require("./mailing");
const mail_1 = require("./mail");
const workflow_1 = require("./workflow");
const author_1 = require("./author");
exports.restApi = express_1.default.Router();
exports.restApi.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("CAA REST API Services");
    }
    catch (error) {
        res.status(500).end();
    }
}));
exports.restApi.use("/domain", domain_1.route);
exports.restApi.use("/account", account_1.route);
exports.restApi.use("/config", config_1.route);
exports.restApi.use("/group", group_1.route);
exports.restApi.use("/form", form_1.route);
exports.restApi.use("/cms", cms_1.cmsApi);
exports.restApi.use("/local", local_1.route);
exports.restApi.use("/mailing", mailing_1.route);
exports.restApi.use("/mail", mail_1.route);
exports.restApi.use("/workflow", workflow_1.route);
exports.restApi.use("/author", author_1.route);
exports.restApi.use("/*", (req, res) => {
    res.sendStatus(404);
});
//# sourceMappingURL=index.js.map