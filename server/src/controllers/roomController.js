const {
  Room,
  Message,
  User
} = require("../models");



/* =========================
   CREATE ROOM
========================= */

exports.createRoom =
  async (req, res) => {

    try {

      const room =
        await Room.create({
          name: req.body.name
        });

      res.status(201).json(room);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Room creation failed"
      });
    }
  };



/* =========================
   GET ROOMS
========================= */

exports.getRooms =
  async (req, res) => {

    try {

      const rooms =
        await Room.findAll({

          include: [
            {
              model: Message,

              limit: 1,

              order: [
                ["createdAt", "DESC"]
              ],

              include: [User]
            }
          ]
        });

      res.json(rooms);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch rooms"
      });
    }
  };