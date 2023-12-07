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
exports.server = void 0;
const fs_1 = __importDefault(require("fs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const REST_1 = require("./Services/REST");
const Auth_1 = require("./Services/Auth");
const accessLogs_1 = __importStar(require("./accessLogs"));
const Middlewares_1 = require("./Services/Middlewares");
const path_1 = __importDefault(require("path"));
const form_1 = require("./Services/form");
const app = (0, express_1.default)();
exports.server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)("NY17STOajOfHAIpNMzLC1OUpkDHrA3ycOK9To"));
app.use(express_1.default.json({
    limit: "30mb",
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(Middlewares_1.cookieMiddleware, (req, _res, next) => {
    if (["/admin/host/ping", "/liveness"].indexOf(req.url) === -1) {
        (0, accessLogs_1.requestLogger)(req);
    }
    next();
});
app.use("/api", REST_1.restApi);
app.use("/auth", Auth_1.authApi);
app.use("/form", form_1.formApi);
app.use("/imgs", Middlewares_1.authMiddleware, express_1.default.static(path_1.default.join(process.cwd(), "/localFile/imgs")));
app.use("/docs", Middlewares_1.authMiddleware, express_1.default.static(path_1.default.join(process.cwd(), "/localFile/docs")));
app.get("/liveness", (req, res) => {
    res.sendStatus(200);
});
app.get("/common.css", (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "common.css"));
});
app.use("/staging", Middlewares_1.authMiddleware, express_1.default.static(path_1.default.join(process.cwd(), "staging")));
app.use("/fonts", Middlewares_1.authMiddleware, express_1.default.static(path_1.default.join(process.cwd(), "fonts")));
app.get("/staging/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = req.url.includes(".html")
        ? path_1.default.join(process.cwd(), req.url)
        : path_1.default.join(process.cwd(), req.url, "index.html");
    if (fs_1.default.existsSync(filePath)) {
        res.sendFile(filePath);
    }
    else {
        res.sendStatus(404);
    }
}));
app.use(express_1.default.static(path_1.default.join(process.cwd(), "build")));
app.get("/*", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(process.cwd(), "build", "index.html"));
}));
function run() {
    const port = process.env.TS_NODE_DEV !== "true" ? 8080 : 488;
    exports.server.listen(port, () => {
        accessLogs_1.default.info(`サーバの起動が完了しました。`);
        accessLogs_1.default.debug(`URL: http://localhost:${port}/`);
    });
}
exports.default = {
    run,
};
//# sourceMappingURL=server.js.map