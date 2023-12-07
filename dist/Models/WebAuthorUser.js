"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthorUserSchema = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const WebAuthor_1 = require("./WebAuthor");
const Account_1 = require("./Account");
exports.WebAuthorUserSchema = database_1.default.define("webAuthorUser", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    webAuthorId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    accountId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
}, {
    tableName: "webAuthorUser",
    modelName: "WebAuthorUser",
    timestamps: true,
    freezeTableName: true,
});
Account_1.AccountSchema.belongsToMany(WebAuthor_1.WebAuthorSchema, { through: exports.WebAuthorUserSchema });
WebAuthor_1.WebAuthorSchema.belongsToMany(Account_1.AccountSchema, { through: exports.WebAuthorUserSchema });
Account_1.AccountSchema.hasMany(exports.WebAuthorUserSchema, { foreignKey: "accountId" });
exports.WebAuthorUserSchema.belongsTo(Account_1.AccountSchema, { foreignKey: "accountId" });
WebAuthor_1.WebAuthorSchema.hasMany(exports.WebAuthorUserSchema, { foreignKey: "webAuthorId" });
exports.WebAuthorUserSchema.belongsTo(WebAuthor_1.WebAuthorSchema, { foreignKey: "webAuthorId" });
//# sourceMappingURL=WebAuthorUser.js.map