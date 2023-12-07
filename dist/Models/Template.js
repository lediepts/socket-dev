"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const Theme_1 = require("./Theme");
exports.TemplateSchema = database_1.default.define("template", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    themeId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    owner: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    subOwner: {
        type: sequelize_1.DataTypes.STRING,
        get() {
            const rawValue = this.getDataValue("subOwner");
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(val) {
            this.setDataValue("subOwner", val ? JSON.stringify(val) : "[]");
        },
    },
    body: {
        type: sequelize_1.DataTypes.TEXT("long"),
        set(val) {
            this.setDataValue("body", val ? JSON.stringify(val) : "{}");
        },
        get() {
            const rawValue = this.getDataValue("body");
            return rawValue ? JSON.parse(rawValue) : {};
        },
    },
    style: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            const rawValue = this.getDataValue("style");
            return rawValue || "";
        },
    },
    script: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            const rawValue = this.getDataValue("script");
            return rawValue || "";
        },
    },
    formStyle: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            const rawValue = this.getDataValue("formStyle");
            return rawValue || "";
        },
    },
    formScript: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            const rawValue = this.getDataValue("formScript");
            return rawValue || "";
        },
    },
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4,
    },
    ver: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: "template",
    modelName: "Template",
    timestamps: true,
    freezeTableName: true,
});
exports.TemplateSchema.belongsTo(Theme_1.ThemeSchema, {
    foreignKey: "themeId",
});
Theme_1.ThemeSchema.hasMany(exports.TemplateSchema, {
    foreignKey: "themeId",
});
//# sourceMappingURL=Template.js.map