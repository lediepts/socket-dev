"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.ThemeSchema = database_1.default.define("theme", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    head: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            return this.getDataValue("head") || "";
        },
    },
    body: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            return this.getDataValue("body") || "";
        },
    },
    style: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            return this.getDataValue("style") || "";
        },
    },
    script: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            return this.getDataValue("script") || "";
        },
    },
}, {
    tableName: "theme",
    modelName: "Theme",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=Theme.js.map