import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IFormAnswer } from "../interfaces";
import { FormSchema } from "./Form";

export interface DevFormAnswerModel
  extends IFormAnswer,
    Model<
      InferAttributes<DevFormAnswerModel>,
      InferCreationAttributes<DevFormAnswerModel>
    > {
  id: CreationOptional<number>;
  answer: CreationOptional<any>;
}

export const DevFormAnswerSchema = database.define<DevFormAnswerModel>(
  "devFormAnswer",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    formId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("answer");
        return rawValue ? JSON.parse(rawValue) : {};
      },
    },
  },
  {
    tableName: "devFormAnswer",
    modelName: "DevFormAnswer",
    timestamps: true,
    freezeTableName: true,
  }
);
FormSchema.hasMany(DevFormAnswerSchema);
DevFormAnswerSchema.belongsTo(FormSchema, { foreignKey: "formId" });
