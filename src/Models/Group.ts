import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { IGroup } from "../interfaces";
import database from "../database";

export interface GroupModel
  extends IGroup,
    Model<InferAttributes<GroupModel>, InferCreationAttributes<GroupModel>> {
  id: CreationOptional<number>;
  description: CreationOptional<string>;
  status: CreationOptional<"active" | "deleted">;
}

export const GroupSchema = database.define<GroupModel>(
  "group",
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
    permission: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val: number[] | string) {
        this.setDataValue(
          "permission",
          typeof val === "string" ? val : val.join("")
        );
      },
      get() {
        const permission = this.getDataValue("permission") as string;
        return permission.split("").map((v) => parseInt(v));
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "deleted"],
      defaultValue: "active",
    },
  },
  {
    tableName: "group",
    modelName: "Group",
    timestamps: true,
    freezeTableName: true,
  }
);
