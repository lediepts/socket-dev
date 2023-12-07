import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IWebAuthor } from "../interfaces";
import { AccountSchema } from "./Account";
import { WebAuthorUserSchema } from "./WebAuthorUser";

export interface WebAuthorModel
  extends IWebAuthor,
    Model<
      InferAttributes<WebAuthorModel>,
      InferCreationAttributes<WebAuthorModel>
    > {
  id: CreationOptional<number>;
  admin: CreationOptional<boolean>;
}

export const WebAuthorSchema = database.define<WebAuthorModel>(
  "webAuthor",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "webAuthor",
    modelName: "WebAuthor",
    timestamps: true,
    freezeTableName: true,
  }
);
