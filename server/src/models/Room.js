const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Room = sequelize.define("Room", {
  name: {
    type: DataTypes.STRING,
    unique: true
  }
});

module.exports = Room;