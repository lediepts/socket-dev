import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { ITheme } from "../interfaces";
import { TemplateSchema } from "./Template";

export interface ThemeModel
  extends ITheme,
    Model<InferAttributes<ThemeModel>, InferCreationAttributes<ThemeModel>> {
  id: CreationOptional<number>;
  head: CreationOptional<string>;
  body: CreationOptional<string>;
  style: CreationOptional<string>;
  script: CreationOptional<string>;
}

export const ThemeSchema = database.define<ThemeModel>(
  "theme",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    head: {
      type: DataTypes.TEXT("long"),
      get() {
        return this.getDataValue("head") || "";
      },
    },
    body: {
      type: DataTypes.TEXT("long"),
      get() {
        return this.getDataValue("body") || "";
      },
    },
    style: {
      type: DataTypes.TEXT("long"),
      get() {
        return this.getDataValue("style") || "";
      },
    },
    script: {
      type: DataTypes.TEXT("long"),
      get() {
        return this.getDataValue("script") || "";
      },
    },
  },
  {
    tableName: "theme",
    modelName: "Theme",
    timestamps: true,
    freezeTableName: true,
  }
);
