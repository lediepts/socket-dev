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
exports.BearMail = void 0;
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const SendMailHistory_1 = require("../Models/SendMailHistory");
const escapeString = (str) => {
    return str
        .replace(/&/gim, "&amp;")
        .replace(/</gim, "&lt;")
        .replace(/>/gim, "&gt;");
};
exports.BearMail = {
    send({ subject, mailing, html, mailingId, sender, organization, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const histories = yield SendMailHistory_1.SendMailHistorySchema.findAll({
                limit: 1,
                where: {},
                order: [["id", "DESC"]],
            }).catch(() => []);
            const last = ((_a = histories[0]) === null || _a === void 0 ? void 0 : _a.id) || 0;
            const deliveryId = (0, moment_1.default)().format("yyyyMMDD") + `${last + 1}`.padStart(7, "0");
            const list = mailing.map((v, i) => {
                return `<data id="${i + 1}">
          <address device="0">${v}</address>
          <int_txt id="1">${escapeString(html)}</int_txt>
        </data>\n`;
            });
            const data = `<?xml version="1.0" encoding="UTF-8"?>
<mail>
    <auth>
      <site id="${process.env.BEAR_SITE_ID || "38"}"/>
      <service id="${process.env.BEAR_SERVICE_ID || "38"}"/>
      <name><![CDATA[${process.env.BEAR_NAME || "SL006509"}]]></name>
      <pass><![CDATA[${process.env.BEAR_PASSWORD || "119229ro4s-mmsi4"}]]></pass>
    </auth>
    <delivery id="${deliveryId}">
        <action>reserve</action>
        <request_id>${process.env.BEAR_NAME || "SL006509"}-${deliveryId}</request_id>
        <setting>
            <send_date>now</send_date>
            <from_name><![CDATA[${process.env.BEAR_FROM_NAME}]]></from_name>
            <from>${process.env.BEAR_FROM_EMAIL}</from>
            <envelope_from>${process.env.BEAR_FROM_ENVELOPE}</envelope_from>
        </setting>
        <contents>
            <subject><![CDATA[${escapeString(subject)}]]></subject>
            <body part="text">
                <![CDATA[##int_txt_1##]]> 
            </body>
            <body part="html">
                <![CDATA[
      <html><head></head><body>
##int_txt_1##</body></html> ]]>
        </body>
    </contents>
    <send_list>
        ${list.join("")}
    </send_list>
</delivery>
</mail>
  `;
            try {
                let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: "https://bmwebapi02.baremetal.jp/tm/lpmail.php",
                    headers: {
                        "Content-Type": "application/xml",
                    },
                    data: data,
                };
                const response = yield axios_1.default.request(config);
                const rs = JSON.stringify(response.data);
                if (rs.includes("errors"))
                    throw rs;
                yield SendMailHistory_1.SendMailHistorySchema.create({
                    body: html,
                    mailingId,
                    sender,
                    organization,
                    subject,
                    status: "success",
                });
            }
            catch (error) {
                console.log(`Bear Mail Error>>`, error.message || error);
                yield SendMailHistory_1.SendMailHistorySchema.create({
                    body: html,
                    mailingId,
                    sender,
                    organization,
                    subject,
                    status: "failed",
                });
                throw error;
            }
        });
    },
};
//# sourceMappingURL=BearMail.js.map