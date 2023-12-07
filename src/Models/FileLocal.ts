import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IFileLocal } from "../interfaces";

export interface FileLocalModel
  extends IFileLocal,
    Model<
      InferAttributes<FileLocalModel>,
      InferCreationAttributes<FileLocalModel>
    > {
  id: CreationOptional<number>;
  pageUses: CreationOptional<any>;
}

export const FileLocalSchema = database.define<FileLocalModel>(
  "fileLocal",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ["imgs", "docs"],
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    size: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    ext: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      set(val?: string) {
        this.setDataValue("desc", val || "");
      },
    },
    pageUses: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("pageUses");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(val) {
        this.setDataValue("pageUses", val ? JSON.stringify(val) : "[]");
      },
    },
  },
  {
    tableName: "fileLocal",
    modelName: "FileLocal",
    timestamps: true,
    freezeTableName: true,
  }
);
