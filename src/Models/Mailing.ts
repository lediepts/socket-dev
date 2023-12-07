import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IMailing } from "../interfaces";
import database from "../database";
import { MailMemberSchema } from "./MailMember";

export interface MailingModel
  extends IMailing,
    Model<
      InferAttributes<MailingModel>,
      InferCreationAttributes<MailingModel>
    > {
  id: CreationOptional<number>;
  allowGroup: CreationOptional<any>;
}

export const MailingSchema = database.define<MailingModel>(
  "mailing",
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allowGroup: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("allowGroup");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(val) {
        this.setDataValue("allowGroup", val ? JSON.stringify(val) : "[]");
      },
    },
  },
  {
    tableName: "mailing",
    modelName: "Mailing",
    timestamps: true,
    freezeTableName: true,
  }
);
