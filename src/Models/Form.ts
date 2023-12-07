import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IForm } from "../interfaces";
import database from "../database";
import { WebSchema } from "./Web";

export interface FormModel
  extends IForm,
    Model<InferAttributes<FormModel>, InferCreationAttributes<FormModel>> {
  id: CreationOptional<number>;
  subOwner: CreationOptional<any>;
  items: CreationOptional<any>;
  status: CreationOptional<"created" | "deleted">;
}

export const FormSchema = database.define<FormModel>(
  "form",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
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
    items: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("items");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(val) {
        this.setDataValue("items", val ? JSON.stringify(val) : "[]");
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue:'created',
    },
  },
  {
    tableName: "form",
    modelName: "Form",
    timestamps: true,
    freezeTableName: true,
  }
);
FormSchema.belongsTo(WebSchema, {
  foreignKey: "webId",
});
WebSchema.hasMany(FormSchema, {
  foreignKey: "webId",
});
