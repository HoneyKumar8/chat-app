const User = require("./User");

const Room = require("./Room");

const Message = require("./Message");

const Conversation = require("./Conversation");

const ConversationParticipant =
  require("./ConversationParticipant");

const ReadReceipt =
  require("./ReadReceipt");



/* =========================
   USER ASSOCIATIONS
========================= */

User.hasMany(Message, {
  foreignKey: "senderId"
});

Message.belongsTo(User, {
  foreignKey: "senderId"
});



/* =========================
   ROOM ASSOCIATIONS
========================= */

Room.hasMany(Message, {
  foreignKey: "roomId"
});

Message.belongsTo(Room, {
  foreignKey: "roomId"
});



/* =========================
   CONVERSATION ASSOCIATIONS
========================= */

Conversation.hasMany(Message, {
  foreignKey: "conversationId"
});

Message.belongsTo(Conversation, {
  foreignKey: "conversationId"
});



/* =========================
   CONVERSATION PARTICIPANTS
========================= */

Conversation.hasMany(
  ConversationParticipant,
  {
    foreignKey: "conversationId"
  }
);

ConversationParticipant.belongsTo(
  Conversation,
  {
    foreignKey: "conversationId"
  }
);

User.hasMany(
  ConversationParticipant,
  {
    foreignKey: "userId"
  }
);

ConversationParticipant.belongsTo(
  User,
  {
    foreignKey: "userId"
  }
);



/* =========================
   READ RECEIPTS
========================= */

Message.hasMany(ReadReceipt, {
  foreignKey: "messageId"
});

ReadReceipt.belongsTo(Message, {
  foreignKey: "messageId"
});

User.hasMany(ReadReceipt, {
  foreignKey: "userId"
});

ReadReceipt.belongsTo(User, {
  foreignKey: "userId"
});



module.exports = {
  User,
  Room,
  Message,
  Conversation,
  ConversationParticipant,
  ReadReceipt
};