const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReadReceipt = sequelize.define("ReadReceipt", {
  readAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = ReadReceipt;