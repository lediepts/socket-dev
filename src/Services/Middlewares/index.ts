import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import { ServiceRequest, TokenInfo } from "../../interfaces";
import { ENVSchema } from "../../Models/ENV";

export const AUTH_TOKEN_SECRET =
  "7354c727be6012b928e95b1103850da68168b55ef0cc41ee45d6a05be642af66f2062300";

export function validatorsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  const errs = errors.mapped();
  if (!errors.isEmpty()) {
    res.send({
      error: true,
      message: Object.keys(errs)
        .map((k) => `${k}:${errs[k].msg}`)
        .join(";"),
    });
  } else next();
}

export const createToken = (tokenInfo: TokenInfo) => {
  try {
    return sign(
      {
        ...tokenInfo,
      },
      AUTH_TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const verifyToken = (token: string) => {
  try {
    if (!token)
      throw {
        message: "token is null",
      };
    const info = verify(token, AUTH_TOKEN_SECRET) as TokenInfo;
    return info;
  } catch (error) {
    return undefined;
  }
};

const cookieName = "__caa";
export async function setAuthCookie(info: TokenInfo, res: Response) {
  const env = await ENVSchema.findAll();
  const cookieMaxAge =
    env.find((f) => f.key === "cookieMaxAge")?.value || "3600000"; // default 1時間;
  const token = createToken(info);
  res.cookie(cookieName, token, {
    maxAge: Number(cookieMaxAge),
    httpOnly: true,
    secure: false,
    signed: true,
  });
}
export function clearCookie(res: Response) {
  res.clearCookie(cookieName);
}

export const cookieMiddleware = (
  req: ServiceRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { __caa } = req.signedCookies;
    const tokenInfo = verifyToken(__caa);
    req.loginInfo = tokenInfo;
    next();
  } catch {
    res.sendStatus(401);
  }
};
export const authMiddleware = (
  req: ServiceRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.loginInfo) {
    next();
  } else {
    res.send({
      error: true,
      message: "権限なし",
    });
  }
};
