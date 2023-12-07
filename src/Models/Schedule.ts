import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { ISchedule } from "../interfaces";
import { PageSchema } from "./Page";

export interface ScheduleModel
  extends ISchedule,
    Model<
      InferAttributes<ScheduleModel>,
      InferCreationAttributes<ScheduleModel>
    > {
  id: CreationOptional<number>;
  mailData: CreationOptional<any>;
  status: CreationOptional<"created" | "finished" | "failed">;
}

export const ScheduleSchema = database.define<ScheduleModel>(
  "schedule",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    taskType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateTime: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    pageId: {
      type: DataTypes.BIGINT.UNSIGNED,
    },
    mailData: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("mailData");
        return rawValue ? JSON.parse(rawValue) : null;
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "created",
    },
  },
  {
    tableName: "schedule",
    modelName: "Schedule",
    timestamps: true,
    freezeTableName: true,
  }
);
ScheduleSchema.hasMany(PageSchema);
PageSchema.belongsTo(ScheduleSchema, { foreignKey: "pageId" });
