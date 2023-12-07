"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const Theme_1 = require("./Theme");
const Web_1 = require("./Web");
exports.PageSchema = database_1.default.define("page", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    webId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    themeId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
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
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["作成済", "更新中", "申請中", "公開済", "非公開"],
        defaultValue: "作成済",
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
    tableName: "page",
    modelName: "Page",
    timestamps: true,
    freezeTableName: true,
});
Web_1.WebSchema.hasMany(exports.PageSchema);
exports.PageSchema.belongsTo(Web_1.WebSchema, { foreignKey: "webId" });
Theme_1.ThemeSchema.hasOne(exports.PageSchema);
exports.PageSchema.belongsTo(Theme_1.ThemeSchema, { foreignKey: "themeId" });
//# sourceMappingURL=Page.js.map