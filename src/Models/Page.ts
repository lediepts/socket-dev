import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUIDV4,
} from "sequelize";
import database from "../database";
import { IPage } from "../interfaces";
import { ThemeSchema } from "./Theme";
import { WebSchema } from "./Web";

export interface PageModel
  extends IPage,
    Model<InferAttributes<PageModel>, InferCreationAttributes<PageModel>> {
  id: CreationOptional<number>;
  description: CreationOptional<string>;
  body: CreationOptional<any>;
  style: CreationOptional<string>;
  script: CreationOptional<string>;
  formStyle: CreationOptional<string>;
  formScript: CreationOptional<string>;
  subOwner: CreationOptional<any>;
  ver: CreationOptional<number>;
  active: CreationOptional<boolean>;
  uuid: CreationOptional<string>;
  status: CreationOptional<
    "作成済" | "更新中" | "申請中" | "公開済" | "非公開"
  >;
}

export const PageSchema = database.define<PageModel>(
  "page",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    webId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    themeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
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
    status: {
      type: DataTypes.ENUM,
      values: ["作成済", "更新中", "申請中", "公開済", "非公開"],
      defaultValue: "作成済",
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
    tableName: "page",
    modelName: "Page",
    timestamps: true,
    freezeTableName: true,
  }
);

WebSchema.hasMany(PageSchema);
PageSchema.belongsTo(WebSchema, { foreignKey: "webId" });

ThemeSchema.hasOne(PageSchema);
PageSchema.belongsTo(ThemeSchema, { foreignKey: "themeId" });
