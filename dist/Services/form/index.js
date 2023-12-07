"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formApi = void 0;
const express_1 = __importDefault(require("express"));
const formConfirm_1 = require("./formConfirm");
exports.formApi = express_1.default.Router();
exports.formApi.use("/", formConfirm_1.route);
//# sourceMappingURL=index.js.map