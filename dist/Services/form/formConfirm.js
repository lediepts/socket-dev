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
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const Form_1 = require("../../Models/Form");
const Web_1 = require("../../Models/Web");
const Middlewares_1 = require("../Middlewares");
const accessLogs_1 = require("../../accessLogs");
exports.route = express_1.default.Router();
exports.route.post("/:id/confirm", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, params: { id }, } = req;
    try {
        const form = yield Form_1.FormSchema.findOne({
            where: {
                id: parseInt(id),
            },
            include: [{ model: Web_1.WebSchema }],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        if (!form) {
            return res.redirect("/error.html");
        }
        const { web: { name: webName }, } = form.toJSON();
        const filePath = process.env.TS_NODE_DEV === "true"
            ? path_1.default.join(process.cwd(), "staging", webName, "form-confirm.html")
            : path_1.default.join("/home/site/wwwroot", "staging", webName, "form-confirm.html");
        const contents = yield (0, promises_1.readFile)(filePath, { encoding: "utf8" });
        let str = `<form action="/form/${id}/accepted" method="POST" style="max-width:960px;margin:0 auto">`;
        str += `<p style="text-align:center;padding:10px;font-weight:bold;font-size:x-large;">入力内容確認</p>
      <noscript>
      <p style="text-align:center;padding:10px;background:#475569;color:#fff;">入力画面に戻りたい場合はブラウザの戻るボタン（左アイコン）を押してください。</p>
      </noscript>
      <p style="text-align:center;padding:10px;">内容を確認後[送信]ボタンを押して内容を登録してください。</p>
    
    `;
        Object.keys(body).forEach((key) => {
            if (key.includes("-display")) {
                str += `<div style="border: 1px solid #ccc;margin:0.5rem auto;box-shadow:0 1px 4px #eee;">
          <p style="background-color: #eee;padding:4px 10px;">${body[key]}</p>
          <p style="padding:1rem;">${body[key.replace("-display", "")]}</p>
        </div>`;
            }
            else {
                str += `<input type="hidden" name="${key}" value="${body[key]}">`;
            }
        });
        str += `<div data-name="action"
      style="position: relative; display: flex; justify-content: space-around; align-items: center; margin: 2rem auto; max-width: 1024px;">
      <button type="submit"
        style="display:flex;width:256px;height:56px;justify-content:center;align-items:center;background:#1D4ED8;border-radius:4px;border:none;font-size:15px;color:#fff;font-weight:500;cursor:pointer;transition:all 200ms">送信</button>
        <script>
        const action = document.querySelector('[data-name="action"]')
        const btn = document.createElement('button')
        btn.type="button"
        btn.style.display = "flex"
        btn.style.width = "256px"
        btn.style.height = "56px"
        btn.style.justifyContent = "center"
        btn.style.alignItems = "center"
        btn.style.background = "#475569"
        btn.style.borderRadius = "4px"
        btn.style.border = "none"
        btn.style.fontSize = "15px"
        btn.style.color = "#fff"
        btn.style.fontWeight = "500"
        btn.style.cursor = "pointer"
        btn.style.transition = "all 200ms"
        btn.innerText = '入力画面に戻る'
        btn.onclick = () => { window.history.back() }
        action.insertBefore(btn,action.firstChild)
      </script>
    </div>`;
        str += "</form>";
        const html = contents.replace("{form-confirm}", str);
        res.setHeader("Content-Type", "text/html");
        return res.send(html);
    }
    catch (error) {
        (0, accessLogs_1.errorLogger)(error.message || error, req);
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
exports.route.post("/:id/accepted", Middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, params: { id }, } = req;
    try {
        console.log({ id, body });
        const form = yield Form_1.FormSchema.findOne({
            where: {
                id: parseInt(id),
            },
            include: [{ model: Web_1.WebSchema }],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        if (!form) {
            return res.redirect("/error.html");
        }
        const { web: { name: webName }, } = form.toJSON();
        res.redirect("/staging/" + webName + "/form-success.html");
    }
    catch (error) {
        res.send({
            error: true,
            message: `エラーが発生しました`,
        });
    }
}));
//# sourceMappingURL=formConfirm.js.map