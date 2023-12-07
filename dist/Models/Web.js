"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.WebSchema = database_1.default.define("web", {
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
    favicon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ogURL: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ogImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ogDescription: {
        type: sequelize_1.DataTypes.TEXT("medium"),
        set(val) {
            this.setDataValue("ogDescription", val || "");
        },
    },
}, {
    tableName: "web",
    modelName: "Web",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=Web.js.map