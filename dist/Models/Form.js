"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const Web_1 = require("./Web");
exports.FormSchema = database_1.default.define("form", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    webId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT("long"),
        get() {
            const rawValue = this.getDataValue("content");
            return rawValue || "[]";
        },
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
    status: {
        type: sequelize_1.DataTypes.STRING,
        get() {
            const rawValue = this.getDataValue("status");
            return rawValue || "";
        },
    },
}, {
    tableName: "form",
    modelName: "Form",
    timestamps: true,
    freezeTableName: true,
});
exports.FormSchema.belongsTo(Web_1.WebSchema, {
    foreignKey: "webId",
});
Web_1.WebSchema.hasMany(exports.FormSchema, {
    foreignKey: "webId",
});
//# sourceMappingURL=Form.js.map