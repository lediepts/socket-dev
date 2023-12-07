import axios from "axios";
import moment from "moment";
import { SendMailHistorySchema } from "../Models/SendMailHistory";

const escapeString = (str: string) => {
  return str
    .replace(/&/gim, "&amp;")
    .replace(/</gim, "&lt;")
    .replace(/>/gim, "&gt;");
};
const getMailData = (subject: string, html: string, to: string[]) => {
  const deliveryId = moment().format("yyyyMMDDHHmmsss");
  return `<?xml version="1.0" encoding="UTF-8"?>
  <mail>
      <auth>
        <site id="${process.env.BEAR_SITE_ID || "38"}"/>
        <service id="${process.env.BEAR_SERVICE_ID || "38"}"/>
        <name><![CDATA[${process.env.BEAR_NAME || "SL006509"}]]></name>
        <pass><![CDATA[${
          process.env.BEAR_PASSWORD || "119229ro4s-mmsi4"
        }]]></pass>
      </auth>
      <delivery id="${deliveryId}">
          <action>reserve</action>
          <request_id>${
            process.env.BEAR_NAME || "SL006509"
          }-${deliveryId}</request_id>
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
          ${to
            .map((v, i) => {
              return `<data id="${i + 1}">
                <address device="0">${v}</address>
                <int_txt id="1">${escapeString(html)}</int_txt>
              </data>\n`;
            })
            .join("")}
      </send_list>
  </delivery>
  </mail>
    `;
};
export const BearMail = {
  async defaultSend({
    subject,
    html,
    to,
  }: {
    subject: string;
    html: string;
    to: string[];
  }) {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://bmwebapi02.baremetal.jp/tm/lpmail.php",
        headers: {
          "Content-Type": "application/xml",
        },
        data: getMailData(subject, html, to),
      };
      const response = await axios.request(config);
      const rs = JSON.stringify(response.data);
      if (rs.includes("errors")) throw rs;
    } catch (error) {
      console.log(`Bear Mail Error>>`, error.message || error);
      throw error;
    }
  },
  async sendToMailing({
    subject,
    mailing,
    html,
    mailingId,
    sender,
    organization,
  }: {
    mailingId: number;
    sender: number;
    organization: number;
    subject: string;
    mailing: string[];
    html: string;
  }) {
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://bmwebapi02.baremetal.jp/tm/lpmail.php",
        headers: {
          "Content-Type": "application/xml",
        },
        data: getMailData(subject, html, mailing),
      };
      const response = await axios.request(config);
      const rs = JSON.stringify(response.data);
      if (rs.includes("errors")) throw rs;
      await SendMailHistorySchema.create({
        body: html,
        mailingId,
        sender,
        organization,
        subject,
        status: "success",
      });
    } catch (error) {
      console.log(`Bear Mail Error>>`, error.message || error);
      await SendMailHistorySchema.create({
        body: html,
        mailingId,
        sender,
        organization,
        subject,
        status: "failed",
      });
      throw error;
    }
  },
};
