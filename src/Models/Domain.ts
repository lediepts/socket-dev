import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IDomain } from "../interfaces";

export interface DomainModel
  extends IDomain,
    Model<InferAttributes<DomainModel>, InferCreationAttributes<DomainModel>> {
  id: CreationOptional<number>;
}

export const DomainSchema = database.define<DomainModel>(
  "domain",
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
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tenantId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "domain",
    modelName: "Domain",
    timestamps: true,
    freezeTableName: true,
  }
);
