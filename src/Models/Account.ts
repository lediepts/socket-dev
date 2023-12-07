import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IAccount } from "../interfaces";
import database from "../database";
import { GroupSchema } from "./Group";
import { PasswordHistorySchema } from "./PasswordHistory";

export interface AccountModel
  extends IAccount,
    Model<
      InferAttributes<AccountModel>,
      InferCreationAttributes<AccountModel>
    > {
  id: CreationOptional<number>;
  password: CreationOptional<string>;
  status: CreationOptional<"active" | "disabled" | "deleted">;
  updatePasswordAt: CreationOptional<number>;
  otpSecret: CreationOptional<string>;
  fallCount: CreationOptional<number>;
  blockedAt: CreationOptional<number>;
  msalVerified: CreationOptional<string>;
}

export const AccountSchema = database.define<AccountModel>(
  "account",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    groupId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["Default", "MSAL"],
      defaultValue: "Default",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    updatePasswordAt: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: new Date().getTime(),
    },
    otpSecret: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    fallCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    blockedAt: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: 0,
    },
    msalVerified: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "disabled", "deleted"],
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "account",
    modelName: "Account",
    timestamps: true,
    freezeTableName: true,
  }
);
GroupSchema.hasMany(AccountSchema);
AccountSchema.belongsTo(GroupSchema, { foreignKey: "groupId" });

AccountSchema.hasMany(PasswordHistorySchema);
PasswordHistorySchema.belongsTo(AccountSchema, { foreignKey: "accountId" });
