const { User } = require("../models");



/* =========================
   GET USERS
========================= */

exports.getUsers =
  async (req, res) => {

    try {

      const users =
        await User.findAll({

          attributes: [
            "id",
            "username",
            "email",
            "status"
          ]
        });

      res.json(users);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch users"
      });
    }
  };