import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IWeb } from "../interfaces";

export interface WebModel
  extends IWeb,
    Model<InferAttributes<WebModel>, InferCreationAttributes<WebModel>> {
  id: CreationOptional<number>;
  ogDescription: CreationOptional<string>;
}

export const WebSchema = database.define<WebModel>(
  "web",
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
    favicon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ogURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ogImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ogDescription: {
      type: DataTypes.TEXT("medium"),
      set(val?: string) {
        this.setDataValue("ogDescription", val || "");
      },
    },
  },
  {
    tableName: "web",
    modelName: "Web",
    timestamps: true,
    freezeTableName: true,
  }
);
