"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const Group_1 = require("./Group");
const PasswordHistory_1 = require("./PasswordHistory");
exports.AccountSchema = database_1.default.define("account", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    groupId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["Default", "MSAL"],
        defaultValue: "Default",
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
    updatePasswordAt: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        defaultValue: new Date().getTime(),
    },
    otpSecret: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
    fallCount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    blockedAt: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
    },
    msalVerified: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["active", "disabled", "deleted"],
        allowNull: false,
        defaultValue: "active",
    },
}, {
    tableName: "account",
    modelName: "Account",
    timestamps: true,
    freezeTableName: true,
});
Group_1.GroupSchema.hasMany(exports.AccountSchema);
exports.AccountSchema.belongsTo(Group_1.GroupSchema, { foreignKey: "groupId" });
exports.AccountSchema.hasMany(PasswordHistory_1.PasswordHistorySchema);
PasswordHistory_1.PasswordHistorySchema.belongsTo(exports.AccountSchema, { foreignKey: "accountId" });
//# sourceMappingURL=Account.js.map