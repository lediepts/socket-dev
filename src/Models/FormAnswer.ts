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

export interface FormAnswerModel
  extends IFormAnswer,
    Model<
      InferAttributes<FormAnswerModel>,
      InferCreationAttributes<FormAnswerModel>
    > {
  id: CreationOptional<number>;
  answer: CreationOptional<any>;
}

export const FormAnswerSchema = database.define<FormAnswerModel>(
  "formAnswer",
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
    tableName: "formAnswer",
    modelName: "FormAnswer",
    timestamps: true,
    freezeTableName: true,
  }
);
FormSchema.hasMany(FormAnswerSchema);
FormAnswerSchema.belongsTo(FormSchema, { foreignKey: "formId" });
