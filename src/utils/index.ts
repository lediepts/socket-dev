import bcrypt from "bcrypt";
import { DomainSchema } from "../Models/Domain";
import { AccountSchema } from "../Models/Account";
import { PasswordHistorySchema } from "../Models/PasswordHistory";
import { ENV } from "../interfaces";
import crypto from "crypto";
import { encode } from "hi-base32";
import * as OTPAuth from "otpauth";
import { GroupSchema } from "../Models/Group";
import axios from "axios";

export function passwordHash(pass: string) {
  return bcrypt.hashSync(pass, 10);
}
export function passwordCompare(hashPass1: string, hashPass2: string) {
  return bcrypt.compareSync(hashPass1, hashPass2);
}
export async function idPassLogin(email: string, password: string, env: ENV[]) {
  const domain = await DomainSchema.findOne({
    where: {
      name: email.split("@").pop(),
    },
  });
  if (!domain) {
    return undefined;
  }
  const account = await AccountSchema.findOne({
    where: {
      type: "Default",
      email,
      status: "active",
    },
    include: [
      {
        model: PasswordHistorySchema,
        attributes: ["password"],
      },
      {
        model: GroupSchema,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
    order: [[PasswordHistorySchema, "id", "desc"]],
  });
  if (!account) {
    return undefined;
  }
  const match = passwordCompare(password, account.password);
  if (!match) {
    const fallCount = account.fallCount + 1;
    const fallMax = env.find((f) => f.key === "fallMax")?.value || "3"; // default 3回;

    if (fallCount < Number(fallMax)) {
      await account.update({
        fallCount,
      });
    } else {
      await account.update({
        fallCount,
        blockedAt: new Date().getTime(),
        status: "disabled",
      });
    }
    return undefined;
  }
  const blockTime = env.find((f) => f.key === "blockTime")?.value || "3600000"; // default 1時間;
  if (account.blockedAt + Number(blockTime) > new Date().getTime()) {
    return undefined;
  } else {
    await account.update({
      status: "active",
    });
  }
  return account;
}

export const generateRandomBase32 = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

export const createOTPAuth = (email: string, otpSecret: string) => {
  const otpauth = new OTPAuth.TOTP({
    issuer: "CAA",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: otpSecret,
  });
  return otpauth;
};

export async function validateHTML(html: string) {
  try {
    const {
      data: { messages },
    } = await axios.post<{
      messages: {
        type: "info" | "error";
        subType?: "warning";
        lastLine: number;
        lastColumn: number;
        firstColumn: number;
        message: string;
        extract: string;
        hiliteStart: number;
        hiliteLength: number;
      }[];
    }>("https://validator.w3.org/nu/?out=json", html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
    return messages;
  } catch (error) {
    console.error("Validation request failed:", error);
    throw error;
  }
}
