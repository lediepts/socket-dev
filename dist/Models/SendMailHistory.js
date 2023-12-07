"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMailHistorySchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.SendMailHistorySchema = database_1.default.define("sendMailHistory", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    mailingId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    sender: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    organization: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    subject: {
        type: sequelize_1.DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue("subject");
            return rawValue || "";
        },
    },
    body: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            const rawValue = this.getDataValue("body");
            return rawValue || "";
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["success", "failed"],
    },
}, {
    tableName: "sendMailHistory",
    modelName: "SendMailHistory",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=SendMailHistory.js.map