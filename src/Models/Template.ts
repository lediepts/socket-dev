import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUIDV4,
} from "sequelize";
import database from "../database";
import { ITemplate } from "../interfaces";
import { ThemeSchema } from "./Theme";

export interface TemplateModel
  extends ITemplate,
    Model<
      InferAttributes<TemplateModel>,
      InferCreationAttributes<TemplateModel>
    > {
  id: CreationOptional<number>;
  body: CreationOptional<any>;
  style: CreationOptional<string>;
  script: CreationOptional<string>;
  formStyle: CreationOptional<string>;
  formScript: CreationOptional<string>;
  subOwner: CreationOptional<any>;
  ver: CreationOptional<number>;
  active: CreationOptional<boolean>;
  uuid: CreationOptional<string>;
}

export const TemplateSchema = database.define<TemplateModel>(
  "template",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    themeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    subOwner: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("subOwner");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(val) {
        this.setDataValue("subOwner", val ? JSON.stringify(val) : "[]");
      },
    },
    body: {
      type: DataTypes.TEXT("long"),
      set(val?: string) {
        this.setDataValue("body", val ? JSON.stringify(val) : "{}");
      },
      get() {
        const rawValue = this.getDataValue("body");
        return rawValue ? JSON.parse(rawValue) : {};
      },
    },
    style: {
      type: DataTypes.TEXT("long"),
      get() {
        const rawValue = this.getDataValue("style");
        return rawValue || "";
      },
    },
    script: {
      type: DataTypes.TEXT("long"),
      get() {
        const rawValue = this.getDataValue("script");
        return rawValue || "";
      },
    },
    formStyle: {
      type: DataTypes.TEXT("long"),
      get() {
        const rawValue = this.getDataValue("formStyle");
        return rawValue || "";
      },
    },
    formScript: {
      type: DataTypes.TEXT("long"),
      get() {
        const rawValue = this.getDataValue("formScript");
        return rawValue || "";
      },
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    ver: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "template",
    modelName: "Template",
    timestamps: true,
    freezeTableName: true,
  }
);

TemplateSchema.belongsTo(ThemeSchema, {
  foreignKey: "themeId",
});
ThemeSchema.hasMany(TemplateSchema, {
  foreignKey: "themeId",
});
