"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLocalSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.FileLocalSchema = database_1.default.define("fileLocal", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["imgs", "docs"],
        allowNull: false,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    size: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    ext: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: sequelize_1.DataTypes.TEXT,
        set(val) {
            this.setDataValue("desc", val || "");
        },
    },
}, {
    tableName: "fileLocal",
    modelName: "FileLocal",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=FileLocal.js.map