"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHistorySchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.PasswordHistorySchema = database_1.default.define("passwordHistory", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    accountId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.ENUM,
        values: ['requireUpdatePassTime'],
        allowNull: false,
    },
}, {
    tableName: "passwordHistory",
    modelName: "PasswordHistory",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=PasswordHistory.js.map