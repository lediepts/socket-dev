"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsApi = void 0;
const express_1 = __importDefault(require("express"));
const page_1 = require("./page");
const theme_1 = require("./theme");
const template_1 = require("./template");
const web_1 = require("./web");
const build_1 = require("./build");
const public_1 = require("./public");
const validate_1 = require("./validate");
exports.cmsApi = express_1.default.Router();
exports.cmsApi.use("/page", page_1.route);
exports.cmsApi.use("/theme", theme_1.route);
exports.cmsApi.use("/template", template_1.route);
exports.cmsApi.use("/web", web_1.route);
exports.cmsApi.use("/build", build_1.route);
exports.cmsApi.use("/public", public_1.route);
exports.cmsApi.use("/validate", validate_1.route);
//# sourceMappingURL=index.js.map