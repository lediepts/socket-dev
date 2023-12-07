"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.ENVSchema = database_1.default.define("env", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    key: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "env",
    modelName: "ENV",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=ENV.js.map