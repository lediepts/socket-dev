import { MailingSchema } from "./Mailing";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IMailMember } from "../interfaces";

export interface MailMemberModel
  extends IMailMember,
    Model<
      InferAttributes<MailMemberModel>,
      InferCreationAttributes<MailMemberModel>
    > {
  id: CreationOptional<number>;
}

export const MailMemberSchema = database.define<MailMemberModel>(
  "mailMember",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "mailMember",
    modelName: "MailMember",
    timestamps: true,
    freezeTableName: true,
  }
);
MailingSchema.hasMany(MailMemberSchema, { foreignKey: "groupId" });
MailMemberSchema.belongsTo(MailingSchema, { foreignKey: "groupId" });
