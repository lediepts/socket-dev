import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IPasswordHistory } from "../interfaces";

export interface PasswordHistoryModel
  extends IPasswordHistory,
    Model<
      InferAttributes<PasswordHistoryModel>,
      InferCreationAttributes<PasswordHistoryModel>
    > {
  id: CreationOptional<number>;
}

export const PasswordHistorySchema = database.define<PasswordHistoryModel>(
  "passwordHistory",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    accountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    password: {
      type: DataTypes.ENUM,
      values:['requireUpdatePassTime'],
      allowNull: false,
    },
  },
  {
    tableName: "passwordHistory",
    modelName: "PasswordHistory",
    timestamps: true,
    freezeTableName: true,
  }
);
