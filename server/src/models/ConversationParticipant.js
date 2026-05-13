const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConversationParticipant = sequelize.define(
  "ConversationParticipant",
  {}
);

module.exports = ConversationParticipant;