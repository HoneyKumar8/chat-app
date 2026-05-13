const {
  Message,
  User
} = require("../models");



/* =========================
   GET ROOM MESSAGES
========================= */

exports.getRoomMessages =
  async (req, res) => {

    try {

      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 20;

      const offset =
        (page - 1) * limit;

      const messages =
        await Message.findAll({

          where: {
            roomId:
              req.params.roomId
          },

          include: User,

          order: [
            ["createdAt", "DESC"]
          ],

          limit,
          offset
        });

      res.json(
        messages.reverse()
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch messages"
      });
    }
  };



/* =========================
   EDIT MESSAGE
========================= */

exports.editMessage =
  async (req, res) => {

    try {

      const message =
        await Message.findByPk(
          req.params.id
        );

      if (!message) {

        return res.status(404).json({
          message:
            "Message not found"
        });
      }

      if (
        message.senderId !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
            "Unauthorized"
        });
      }

      message.content =
        req.body.content;

      message.isEdited = true;

      await message.save();

      const updatedMessage =
        await Message.findByPk(
          message.id,
          {
            include: User
          }
        );

      res.json(updatedMessage);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to edit message"
      });
    }
  };



/* =========================
   DELETE MESSAGE
========================= */

exports.deleteMessage =
  async (req, res) => {

    try {

      const message =
        await Message.findByPk(
          req.params.id
        );

      if (!message) {

        return res.status(404).json({
          message:
            "Message not found"
        });
      }

      if (
        message.senderId !==
        req.user.id
      ) {

        return res.status(403).json({
          message:
            "Unauthorized"
        });
      }

      message.content =
        "Message deleted";

      message.isDeleted = true;

      await message.save();

      res.json({
        id: message.id
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete message"
      });
    }
  };