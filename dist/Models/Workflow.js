"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const Account_1 = require("./Account");
const Page_1 = require("./Page");
const WebAuthor_1 = require("./WebAuthor");
exports.WorkflowSchema = database_1.default.define("workflow", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    sender: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    pageId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    authorizer: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    approver: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
    },
    other: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
    hopeTime: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        set(val) {
            this.setDataValue("hopeTime", val || new Date().getTime());
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["created", "accepted", "rejected", "remanded"],
        defaultValue: "created",
    },
}, {
    tableName: "workflow",
    modelName: "Workflow",
    timestamps: true,
    freezeTableName: true,
});
exports.WorkflowSchema.belongsTo(Account_1.AccountSchema, { foreignKey: "sender" });
exports.WorkflowSchema.belongsTo(Account_1.AccountSchema, { foreignKey: "approver" });
exports.WorkflowSchema.belongsTo(Page_1.PageSchema, { foreignKey: "pageId" });
exports.WorkflowSchema.belongsTo(WebAuthor_1.WebAuthorSchema, { foreignKey: "authorizer" });
//# sourceMappingURL=Workflow.js.map