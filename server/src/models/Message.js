const { DataTypes } =
  require("sequelize");

const sequelize =
  require("../config/database");

const Message =
  sequelize.define("Message", {

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },

    fileType: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

module.exports = Message;