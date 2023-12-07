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
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("node:fs/promises");
const path_1 = __importDefault(require("path"));
const Page_1 = require("../../../Models/Page");
const Template_1 = require("../../../Models/Template");
const Theme_1 = require("../../../Models/Theme");
const Web_1 = require("../../../Models/Web");
const accessLogs_1 = require("../../../accessLogs");
const Middlewares_1 = require("../../Middlewares");
const staging = path_1.default.join(process.cwd(), `staging`);
exports.route = express_1.default.Router();
exports.route.post("/web", (0, express_validator_1.body)("id").exists(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, body: { id }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const web = yield Web_1.WebSchema.findByPk(id);
        if (!web) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        (0, accessLogs_1.successLogger)(`web: ${web.name} is public success!`, req);
        res.send({
            message: `web: ${web.name} is build success!`,
        });
    }
    catch (error) {
        console.log("server/src/Services/REST/cms/public.ts:82>>", error);
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.post("/page", (0, express_validator_1.body)("id").exists(), Middlewares_1.validatorsMiddleware, Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginInfo, body: { id }, } = req;
        if (!loginInfo || loginInfo.permissions[0] < 4) {
            (0, accessLogs_1.errorLogger)("権限なし", req);
            return res.send({
                error: true,
                message: "権限なし",
            });
        }
        const page = yield Page_1.PageSchema.findByPk(id, {
            include: [
                {
                    model: Web_1.WebSchema,
                },
                {
                    model: Template_1.TemplateSchema,
                    include: [
                        {
                            model: Theme_1.ThemeSchema,
                        },
                    ],
                },
            ],
        });
        if (!page || !page.active) {
            (0, accessLogs_1.warningLogger)("存在していません", req);
            return res.send({
                error: true,
                message: `存在していません`,
            });
        }
        yield buildPage(page);
        yield Page_1.PageSchema.create({
            webId: page.webId,
            themeId: page.themeId,
            url: page.url,
            title: page.title,
            description: page.description,
            owner: page.owner,
            subOwner: page.subOwner,
            body: page.body,
            uuid: page.uuid,
            ver: page.ver,
            id: undefined,
            active: false,
        });
        yield page.update({
            active: true,
            ver: page.ver + 1,
        });
        (0, accessLogs_1.successLogger)(`page: ${page.url} is build success!`, req);
        res.send({
            page,
            message: `page: ${page.url} is build success!`,
        });
    }
    catch (error) {
        console.log(error);
        (0, accessLogs_1.errorLogger)("error", req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
function buildPage(page, env = "staging") {
    return __awaiter(this, void 0, void 0, function* () {
        const webFolder = path_1.default.join(staging, page.web.name);
        if (!fs_1.default.existsSync(webFolder)) {
            fs_1.default.mkdirSync(webFolder);
            const source = path_1.default.join(process.cwd(), "/common.css");
            const destination = path_1.default.join(webFolder, "/common.css");
            yield (0, promises_1.copyFile)(source, destination, promises_1.constants.COPYFILE_FICLONE);
        }
        const imgFolder = path_1.default.join(webFolder, `imgs`);
        if (!fs_1.default.existsSync(imgFolder)) {
            fs_1.default.mkdirSync(imgFolder);
        }
        const docFolder = path_1.default.join(webFolder, `docs`);
        if (!fs_1.default.existsSync(docFolder)) {
            fs_1.default.mkdirSync(docFolder);
        }
        const filePaths = page.url.split("/").filter((f) => !!f);
        const filename = filePaths.pop();
        if (!filename)
            throw 1;
        const folderPath = path_1.default.join(webFolder, filePaths.join("/"));
        if (!fs_1.default.existsSync(folderPath)) {
            fs_1.default.mkdirSync(folderPath, { recursive: true });
        }
        const sc = env === "product"
            ? ""
            : `window.onload = ()=>{
    document.querySelectorAll("a").forEach(elm=>{
      const url = new URL(elm.href)
      if(url.hostname===location.hostname){
        elm.href = url.origin +"/staging/${page.web.name}"+ url.pathname
      }
    })
  }`;
        let code = page.template.theme.body;
        const tmp = code.match(/(?<={block:)(\d|\w){13}(?=})/gm);
        if (!tmp)
            return;
        tmp.forEach((id) => {
            code = code.replace(`{block:${id}}`, page.body[id] || `<div data-editable="${id}"></div>`);
        });
        const html = `<!doctype html><html><head>${page.template.theme.head}${generateOGP(page.title, new URL(page.url, page.web.ogURL).href, page.web.ogImage, page.description || page.web.ogDescription)}<style>${page.template.theme.style}</style></head><body>${code}</body><script>${sc}${page.template.theme.script}</script></html>`;
        yield fs_1.default.writeFileSync(path_1.default.join(folderPath, filename), html);
        const matchImg = html.match(/[A-z0-9_]+.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|webp)/gim);
        if (matchImg) {
            for (const img of matchImg) {
                const source = path_1.default.join(process.cwd(), "/localFile/imgs/", img);
                const destination = path_1.default.join(imgFolder, img);
                try {
                    yield (0, promises_1.copyFile)(source, destination, promises_1.constants.COPYFILE_FICLONE);
                }
                catch (error) {
                    console.log(error.message);
                }
            }
        }
        const matchDoc = html.match(/[A-z0-9_]+.(csv|doc|docx|xls(x)?|pdf)/gim);
        if (matchDoc) {
            for (const doc of matchDoc) {
                const source = path_1.default.join(process.cwd(), "/localFile/docs/", doc);
                const destination = path_1.default.join(docFolder, doc);
                try {
                    yield (0, promises_1.copyFile)(source, destination, promises_1.constants.COPYFILE_FICLONE);
                }
                catch (error) {
                    console.log(error.message);
                }
            }
        }
    });
}
function generateOGP(title, ogURL, ogImage, description) {
    return `<meta property="og:type" content= "website" />
  <meta property="og:url" content="${ogURL}"/>
  <meta property="og:site_name" content="${title}" />
  <meta property="og:image" itemprop="image primaryImageOfPage" content="${ogImage}" />
  <meta name="twitter:card" content="summary"/>
  <meta name="twitter:domain" content="${ogURL}"/>
  <meta name="twitter:title" property="og:title" itemprop="name" content="${title}" />
  <meta name="twitter:description" property="og:description" itemprop="description" content="${description}" />`;
}
//# sourceMappingURL=public.js.map