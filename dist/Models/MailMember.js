"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailMemberSchema = void 0;
const Mailing_1 = require("./Mailing");
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
exports.MailMemberSchema = database_1.default.define("mailMember", {
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    groupId: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "mailMember",
    modelName: "MailMember",
    timestamps: true,
    freezeTableName: true,
});
Mailing_1.MailingSchema.hasMany(exports.MailMemberSchema, { foreignKey: "groupId" });
exports.MailMemberSchema.belongsTo(Mailing_1.MailingSchema, { foreignKey: "groupId" });
//# sourceMappingURL=MailMember.js.map