import express from "express";
import { route as formConfirm } from "./formConfirm";

export const formApi = express.Router();
formApi.use("/", formConfirm);
