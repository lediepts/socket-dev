import { AccountSchema } from "./Models/Account";
import { DomainSchema } from "./Models/Domain";
import { ENVSchema } from "./Models/ENV";
import { FormSchema } from "./Models/Form";
import { GroupSchema } from "./Models/Group";
import { PageSchema } from "./Models/Page";
import { TemplateSchema } from "./Models/Template";
import { WebSchema } from "./Models/Web";
import { ENV, IAccount, IDomain, IGroup } from "./interfaces";

async function initDatabase() {
  // await TemplateSchema.sync({ force: true });
  // await PageSchema.sync({ force: true });
  // await WebSchema.sync({ force: true });
  // await FormSchema.sync({ force: true });
  // await DomainSchema.sync({ force: true });
  const domains: IDomain[] = [
    {
      id: 1,
      name: "portalcaa.onmicrosoft.com",
      displayName: "CAA Portal",
      clientId: "e6f4befb-6ccf-4c1e-b5e6-f8e75088fe8b",
      tenantId: "1c17e03c-3406-4b73-86fb-f41b174cfb67",
    },
    {
      id: 2,
      name: "caa.go.jp",
      displayName: "消費者庁",
      clientId: "c2d2030a-3840-4bb9-9f06-51c838231b58",
      tenantId: "ea7b8131-2b41-47f3-bd28-06ab6b980dab",
    },
    {
      id: 3,
      name: "0004s.com",
      displayName: "フォーシーズンズ",
      clientId: "712e8632-fe87-4cdf-8e2b-eba01bdbe799",
      tenantId: "c2e38960-a636-410c-9936-5af49e3d2402",
    },
    {
      id: 4,
      name: "outlook.com",
      displayName: "開発用",
      clientId: "41345320-8046-4745-ac4f-d2f3654d3f63",
      tenantId: "94a2a2e1-451c-455d-b1f4-a838a2025c08",
    },
  ];
  for (const { id, clientId, name, displayName, tenantId } of domains) {
    await DomainSchema.findOrCreate({
      where: {
        id,
      },
      defaults: {
        clientId,
        name,
        displayName,
        tenantId,
      },
    });
  }
  const groups: Omit<IGroup, "status" | "description">[] = [
    {
      id: 1,
      name: "システム管理者",
      permission: "7777777",
    },
    {
      id: 2,
      name: "消費者庁（デジタル推進室）",
      permission: "7777710",
    },
    {
      id: 3,
      name: "DEV-MEMBER",
      permission: "0030000",
    },
    {
      id: 4,
      name: "団体",
      permission: "0030000",
    },
  ];
  const accounts: Omit<
    IAccount,
    | "status"
    | "msalVerified"
    | "blockedAt"
    | "fallCount"
    | "otpApplied"
    | "otpSecret"
    | "updatePasswordAt"
  >[] = [
    {
      id: 1,
      type: "Default",
      groupId: 1,
      name: "dev",
      email: "web@0004s.com",
      password: "$2b$10$0P5ThK.ItjyMx6wlv8Hi7e1jKnbR8I2TaTXqRzHCnzl6g/D0SYLCy",
    },
    {
      id: 2,
      type: "MSAL",
      groupId: 1,
      name: "Le Diep",
      email: "diep.le@0004s.com",
      password: "",
    },
    {
      id: 3,
      type: "MSAL",
      groupId: 1,
      name: "DEV02",
      email: "d.takeuchi@0004s.com",
      password: "",
    },
    {
      id: 4,
      type: "MSAL",
      groupId: 1,
      name: "Le Diep",
      email: "dev_usr0001@portalcaa.onmicrosoft.com",
      password: "",
    },
    {
      id: 5,
      type: "MSAL",
      groupId: 1,
      name: "dev_usr0002",
      email: "dev_usr0002@portalcaa.onmicrosoft.com",
      password: "",
    },
    {
      id: 6,
      type: "MSAL",
      groupId: 1,
      name: "dev_usr0003",
      email: "dev_usr0003@portalcaa.onmicrosoft.com",
      password: "",
    },
    {
      id: 7,
      type: "MSAL",
      groupId: 1,
      name: "ポータル管理者",
      email: "sys_adm0001@portalcaa.onmicrosoft.com",
      password: "",
    },
    {
      id: 8,
      type: "MSAL",
      groupId: 2,
      name: "消費者庁アカウント①",
      email: "caa_usr0001@portalcaa.onmicrosoft.com",
      password: "",
    },
    {
      id: 9,
      type: "MSAL",
      groupId: 4,
      name: "団体用アカウント①",
      email: "grp_usr0001@portalcaa.onmicrosoft.com",
      password: "",
    },
    {
      id: 10,
      type: "MSAL",
      groupId: 1,
      name: "dev",
      email: "dieplh2023@outlook.com",
      password: "",
    },
    {
      id: 11,
      type: "Default",
      groupId: 1,
      name: "dev1",
      email: "web1@0004s.com",
      password: "$2b$10$0P5ThK.ItjyMx6wlv8Hi7e1jKnbR8I2TaTXqRzHCnzl6g/D0SYLCy",
    },
    {
      id: 12,
      type: "MSAL",
      groupId: 1,
      name: "dev02",
      email: "n.ishikawa@0004s.com",
      password: "",
    },
    {
      id: 13,
      type: "MSAL",
      groupId: 1,
      name: "ebihara",
      email: "s.ebihara@0004s.com",
      password: "",
    },
    {
      id: 14,
      type: "MSAL",
      groupId: 1,
      name: "m.saitoh",
      email: "m.saitoh@0004s.com",
      password: "",
    },
    {
      id: 15,
      type: "MSAL",
      groupId: 1,
      name: "s.matsuura",
      email: "s.matsuura@0004s.com",
      password: "",
    },
  ];
  for (const { id, name, permission } of groups) {
    await GroupSchema.findOrCreate({
      where: {
        id,
      },
      defaults: {
        name,
        permission,
      },
    });
  }
  for (const { id, email, groupId, name, password, type } of accounts) {
    await AccountSchema.findOrCreate({
      where: {
        id,
      },
      defaults: {
        email,
        groupId,
        name,
        password,
        type,
      },
    });
  }
  const settings: ENV[] = [
    {
      id: 1,
      key: "blockTime",
      value: "3600000",
    },
    {
      id: 2,
      key: "cookieMaxAge",
      value: "3600000",
    },
    {
      id: 3,
      key: "fallMax",
      value: "3",
    },
    {
      id: 4,
      key: "passwordHistoryMax",
      value: "3",
    },
    {
      id: 5,
      key: "requireUpdatePassTime",
      value: "7776000000",
    },
    {
      id: 6,
      key: "signinAge",
      value: "3600000",
    },
    {
      id: 7,
      key: "passwordRole",
      value:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$&()+-¥/;:<>?@]).{14,}$",
    },
  ];
  for (const { id, key, value } of settings) {
    await ENVSchema.findOrCreate({
      where: {
        id,
      },
      defaults: {
        key,
        value,
      },
    });
  }
}
export default initDatabase;
