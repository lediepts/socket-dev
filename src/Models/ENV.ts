import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { ENV } from "../interfaces";

export interface ENVModel
  extends ENV,
    Model<InferAttributes<ENVModel>, InferCreationAttributes<ENVModel>> {
  id: CreationOptional<number>;
}

export const ENVSchema = database.define<ENVModel>(
  "env",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "env",
    modelName: "ENV",
    timestamps: true,
    freezeTableName: true,
  }
);
