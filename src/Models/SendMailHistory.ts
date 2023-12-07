import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { ISendMailHistory } from "../interfaces";
import database from "../database";

export interface SendMailHistoryModel
  extends ISendMailHistory,
    Model<
      InferAttributes<SendMailHistoryModel>,
      InferCreationAttributes<SendMailHistoryModel>
    > {
  id: CreationOptional<number>;
}

export const SendMailHistorySchema = database.define<SendMailHistoryModel>(
  "sendMailHistory",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    mailingId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    sender: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    organization: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    subject: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("subject");
        return rawValue || "";
      },
    },
    body: {
      type: DataTypes.TEXT("long"),
      get() {
        const rawValue = this.getDataValue("body");
        return rawValue || "";
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["success", "failed"],
    },
  },
  {
    tableName: "sendMailHistory",
    modelName: "SendMailHistory",
    timestamps: true,
    freezeTableName: true,
  }
);
