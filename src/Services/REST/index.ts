import express from "express";
import { route as domain } from "./domain";
import { route as account } from "./account";
import { route as config } from "./config";
import { route as group } from "./group";
import { route as form } from "./form";
import { route as local } from "./local";
import { cmsApi as cms } from "./cms";
import { route as mailing } from "./mailing";
import { route as mail } from "./mail";
import { route as workflow } from "./workflow";
import { route as author } from "./author";
import { route as formAnswer } from "./formAnswer";
import { route as schedule } from "./schedule";

export const restApi = express.Router();

restApi.get("/", async (req, res) => {
  try {
    res.send("CAA REST API Services");
  } catch (error) {
    res.status(500).end();
  }
});

restApi.use("/domain", domain);
restApi.use("/account", account);
restApi.use("/config", config);
restApi.use("/group", group);
restApi.use("/form", form);
restApi.use("/cms", cms);
restApi.use("/local", local);
restApi.use("/mailing", mailing);
restApi.use("/mail", mail);
restApi.use("/workflow", workflow);
restApi.use("/author", author);
restApi.use("/form-answer", formAnswer);
restApi.use("/schedule", schedule);

restApi.use("/*", (req, res) => {
  res.sendStatus(404);
});
