import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import database from "../database";
import { IWorkflow } from "../interfaces";
import { AccountSchema } from "./Account";
import { PageSchema } from "./Page";
import { WebAuthorSchema } from "./WebAuthor";

export interface WorkflowModel
  extends IWorkflow,
    Model<
      InferAttributes<WorkflowModel>,
      InferCreationAttributes<WorkflowModel>
    > {
  id: CreationOptional<number>;
  other: CreationOptional<string>;
  status: CreationOptional<"created" | "accepted" | "rejected" | "remanded">;
}

export const WorkflowSchema = database.define<WorkflowModel>(
  "workflow",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    sender: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    pageId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    authorizer: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    approver: {
      type: DataTypes.BIGINT.UNSIGNED,
    },
    other: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    hopeTime: {
      type: DataTypes.BIGINT.UNSIGNED,
      set(val?: number) {
        this.setDataValue("hopeTime", val || new Date().getTime());
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: ["public", "unPublic"],
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["created", "accepted", "rejected", "remanded"],
      defaultValue: "created",
    },
  },
  {
    tableName: "workflow",
    modelName: "Workflow",
    timestamps: true,
    freezeTableName: true,
  }
);

WorkflowSchema.belongsTo(AccountSchema, {
  as: "senderUser",
  foreignKey: "sender",
});
WorkflowSchema.belongsTo(AccountSchema, {
  as: "approverUser",
  foreignKey: "approver",
});
WorkflowSchema.belongsTo(PageSchema, { foreignKey: "pageId" });
WorkflowSchema.belongsTo(WebAuthorSchema, { foreignKey: "authorizer" });
