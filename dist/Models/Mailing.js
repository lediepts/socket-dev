"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailingSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.MailingSchema = database_1.default.define("mailing", {
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
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    allowGroup: {
        type: sequelize_1.DataTypes.STRING,
        get() {
            const rawValue = this.getDataValue("allowGroup");
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(val) {
            this.setDataValue("allowGroup", val ? JSON.stringify(val) : "[]");
        },
    },
}, {
    tableName: "mailing",
    modelName: "Mailing",
    timestamps: true,
    freezeTableName: true,
});
//# sourceMappingURL=Mailing.js.map