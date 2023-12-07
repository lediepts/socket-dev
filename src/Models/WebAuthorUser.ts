import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IWebAuthorUser } from "../interfaces";
import { WebAuthorSchema } from "./WebAuthor";
import { AccountSchema } from "./Account";

export interface WebAuthorUserModel
  extends IWebAuthorUser,
    Model<
      InferAttributes<WebAuthorUserModel>,
      InferCreationAttributes<WebAuthorUserModel>
    > {
  id: CreationOptional<number>;
}

export const WebAuthorUserSchema = database.define<WebAuthorUserModel>(
  "webAuthorUser",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    webAuthorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "webAuthorUser",
    modelName: "WebAuthorUser",
    timestamps: true,
    freezeTableName: true,
  }
);
AccountSchema.belongsToMany(WebAuthorSchema, { through: WebAuthorUserSchema });
WebAuthorSchema.belongsToMany(AccountSchema, { through: WebAuthorUserSchema });

AccountSchema.hasMany(WebAuthorUserSchema, {foreignKey:"accountId"});
WebAuthorUserSchema.belongsTo(AccountSchema, {foreignKey:"accountId"});

WebAuthorSchema.hasMany(WebAuthorUserSchema,{foreignKey:"webAuthorId"});
WebAuthorUserSchema.belongsTo(WebAuthorSchema,{foreignKey:"webAuthorId"});