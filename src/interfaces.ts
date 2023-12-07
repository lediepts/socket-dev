import { Request } from "express";
import * as core from "express-serve-static-core";

export const enum PERMISSION {
  CMS = 0,
  FORM = 1,
  MAIL = 2,
  MAIL_ADDRESS = 3,
  ACCOUNT = 4,
  FORM_ANSWER = 5,
  CONFIG = 6,
}
export type SocketChanel =
  | "config"
  | "group"
  | "form"
  | "account"
  | "domain"
  | "cms-theme"
  | "cms-template"
  | "cms-page"
  | "cms-web"
  | "mail-group"
  | "mail-history"
  | "author"
  | "workflow"
  | "local";
export type SocketAction = "created" | "updated" | "deleted" | "async";
export interface TokenInfo {
  id: number;
  name: string;
  email: string;
  type: "Default" | "MSAL";
  groupId: number;
  groupName: string;
  permissions: number[];
  workflow?: {
    email: string;
    admin: boolean;
  };
}

export interface ServiceRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  loginInfo?: TokenInfo;
}

export interface IDomain {
  id: number;
  name: string;
  displayName: string;
  clientId: string;
  tenantId: string;
}

export interface IGroup {
  id: number;
  name: string;
  permission: number[] | string;
  description: string;
  status: "active" | "deleted";
}

export interface IAccount {
  id: number;
  type: "Default" | "MSAL";
  groupId: number;
  name: string;
  email: string;
  password: string;
  updatePasswordAt: number;
  otpSecret: string;
  fallCount: number;
  blockedAt: number;
  msalVerified: string;
  status: "active" | "disabled" | "deleted";
}

export interface IPasswordHistory {
  id: number;
  accountId: number;
  password: string;
}
export type ENV_KEY =
  | "requireUpdatePassTime"
  | "blockTime"
  | "fallMax"
  | "cookieMaxAge"
  | "signinAge"
  | "passwordRole"
  | "passwordHistoryMax";
export interface ENV {
  id: number;
  key: ENV_KEY;
  value: string;
}

export interface IHistory {
  id: number;
  userName: string;
  message: string;
  createdAt: number;
}

export interface ITheme {
  id: number;
  name: string;
  head: string;
  style: string;
  script: string;
  body: string;
}

export interface IWeb {
  id: number;
  name: string;
  favicon: string;
  ogURL: string;
  ogImage: string;
  ogDescription: string;
}
type PageStatus = "作成済" | "更新中" | "申請中" | "公開済" | "非公開";
export interface IPage {
  id: number;
  webId: number;
  themeId: number;
  url: string;
  title: string;
  description: string;
  owner: number;
  subOwner: number[]; // '[1,2,3,4]'
  body: { [key: string]: string };
  style: string;
  script: string;
  formStyle: string;
  formScript: string;
  uuid: string; // ver 管理ため
  ver: number;
  active: boolean; // 使うかどうか(削除したらfalseになる)
  status: PageStatus;
}
export interface ITemplate {
  id: number;
  themeId: number;
  name: string;
  owner: number;
  subOwner: number[]; // '[1,2,3,4]'
  body: { [key: string]: string };
  style: string;
  script: string;
  formStyle: string;
  formScript: string;
  uuid: string; // ver 管理ため
  ver: number;
  active: boolean;
}

export interface IFileLocal {
  id: number;
  name: string;
  type: "imgs" | "docs";
  path: string;
  size: number;
  ext: string;
  desc: string;
  pageUses: string[];
}
export interface IForm {
  id: number;
  webId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  status: "created" | "deleted";
  owner: number;
  subOwner: number[];
  items: IFormItem[];
}

export interface IMailing {
  id: number;
  name: string;
  type: string;
  allowGroup: number[]; // [1,2,3]
}
export interface IMailMember {
  id: number;
  groupId: number;
  email: string;
}
export interface ISendMailHistory {
  id: number;
  subject: string;
  body: string;
  sender: number;
  organization: number;
  mailingId: number;
  status: "success" | "failed";
}
export interface IWorkflow {
  id: number;
  sender: number;
  authorizer: number;
  approver?: number;
  pageId: number;
  other?: string;
  hopeTime?: number;
  type: "public" | "unPublic";
  status: "created" | "accepted" | "rejected" | "remanded";
}
export interface IWebAuthor {
  id: number;
  email: string;
  admin: boolean;
}
export interface IWebAuthorUser {
  id: number;
  webAuthorId: number;
  accountId: number;
}
export interface IFormItem {
  format?:
    | "短文"
    | "日付"
    | "選択肢"
    | "文章（回答なし）"
    | "長文"
    | "メールアドレス"
    | "一覧";
  display: string;
  placeholder?: string;
  minlength?: string;
  maxlength?: string;
  rows?: string;
  textType?: "en" | "num" | "en-num" | "ja" | "en-num-sym";
  required?: boolean;
  options: {
    id: string;
    text: string;
  }[];
  multiSelect?: boolean;
  useTime?: boolean;
  name: string;
  branch?: boolean;
  branchItems?: {
    option: string;
    list: IFormItem[];
  }[];
}

export interface IFormAnswer {
  id: number;
  formId: number;
  answer: { [key: string]: string };
}
export interface ISchedule {
  id: number;
  taskType: "public" | "un-public" | "send-mail";
  dateTime: number;
  pageId?: number;
  mailData?: {
    mailingId: number;
    sender: number;
    organization: number;
    subject: string;
    mailing: string[];
    html: string;
  };
  status: "created" | "finished" | "failed";
}
