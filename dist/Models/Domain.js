"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.DomainSchema = database_1.default.define("domain", {
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
    displayName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    clientId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    tenantId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: "domain",
    modelName: "Domain",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=Domain.js.map