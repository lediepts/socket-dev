import express from "express";
import { route as page } from "./page";
import { route as theme } from "./theme";
import { route as template } from "./template";
import { route as web } from "./web";
import { route as validate } from "./validate";

export const cmsApi = express.Router();

cmsApi.use("/page", page);
cmsApi.use("/theme", theme);
cmsApi.use("/template", template);
cmsApi.use("/web", web);
cmsApi.use("/validate", validate);
