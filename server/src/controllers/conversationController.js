const {
  Conversation,
  ConversationParticipant,
  Message,
  User
} = require("../models");



/* =========================
   CREATE CONVERSATION
========================= */

exports.createConversation =
  async (req, res) => {

    try {

      const currentUserId =
        req.user.id;

      const {
        userId: otherUserId
      } = req.body;

      const conversations =
        await Conversation.findAll({

          include: [
            {
              model:
                ConversationParticipant
            }
          ]
        });

      let existingConversation =
        null;

      for (const conversation of conversations) {

        const participantIds =
          conversation
            .ConversationParticipants
            .map(
              (participant) =>
                participant.userId
            );

        const hasBothUsers =

          participantIds.includes(
            currentUserId
          ) &&

          participantIds.includes(
            otherUserId
          ) &&

          participantIds.length === 2;

        if (hasBothUsers) {

          existingConversation =
            conversation;

          break;
        }
      }

      if (existingConversation) {

        return res.json(
          existingConversation
        );
      }

      const conversation =
        await Conversation.create();

      await ConversationParticipant.bulkCreate([

        {
          conversationId:
            conversation.id,

          userId:
            currentUserId
        },

        {
          conversationId:
            conversation.id,

          userId:
            otherUserId
        }
      ]);

      res.status(201).json(
        conversation
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to create conversation"
      });
    }
  };



/* =========================
   GET CONVERSATION MESSAGES
========================= */

exports.getConversationMessages =
  async (req, res) => {

    try {

      const messages =
        await Message.findAll({

          where: {
            conversationId:
              req.params.id
          },

          include: User,

          order: [
            ["createdAt", "ASC"]
          ]
        });

      res.json(messages);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch messages"
      });
    }
  };