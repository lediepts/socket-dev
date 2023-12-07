"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.GroupSchema = database_1.default.define("group", {
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
    permission: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue("permission", typeof val === "string" ? val : val.join(""));
        },
        get() {
            const permission = this.getDataValue("permission");
            return permission.split("").map((v) => parseInt(v));
        },
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: "",
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["active", "deleted"],
        defaultValue: "active",
    },
}, {
    tableName: "group",
    modelName: "Group",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=Group.js.map