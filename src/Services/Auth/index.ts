import express, { Response } from "express";
import { AccountSchema } from "../../Models/Account";
import { GroupSchema } from "../../Models/Group";
import { ServiceRequest, TokenInfo } from "../../interfaces";
import { clearCookie, setAuthCookie, verifyToken } from "../Middlewares";
import { route as idPass } from "./idPass";
import { route as msal } from "./msal";
import { WebAuthorUserSchema } from "../../Models/WebAuthorUser";
import { WebAuthorSchema } from "../../Models/WebAuthor";

export const authApi = express.Router();

authApi.get("/", async (req: ServiceRequest, res: Response) => {
  try {
    const { __caa } = req.signedCookies;
    const info = verifyToken(__caa);
    if (!info) {
      clearCookie(res);
      return res.send({
        error: true,
      });
    }
    const account = await AccountSchema.findOne({
      where: {
        id: info.id,
        status: "active",
      },
      include: [
        {
          model: GroupSchema,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });
    if (!account) {
      clearCookie(res);
      return res.send({ error: true });
    }
    const webAuthorUser = await WebAuthorUserSchema.findOne({
      where: {
        accountId: account.id,
      },
    });
    const webAuthor = await WebAuthorSchema.findByPk(webAuthorUser?.toJSON().webAuthorId)
    const tokenInfo: TokenInfo = {
      id: account.id,
      name: account.name,
      email: account.email,
      type: account.type,
      groupId: (account as any).group.id,
      groupName: (account as any).group.name,
      permissions: (account as any).group.permission,
      workflow: webAuthor?{
        email:webAuthor.email,
        admin:webAuthor.admin
      }:undefined
    };
    await setAuthCookie(tokenInfo, res);
    res.send({ tokenInfo });
  } catch (error) {
    console.log(error);
    res.send({
      error: true,
    });
  }
});

authApi.use("/login", idPass);
authApi.use("/login/msal", msal);

authApi.post("/logout", async (_req, res) => {
  clearCookie(res);
  res.redirect("/");
});

authApi.use("/*", (req, res) => {
  res.sendStatus(404);
});
