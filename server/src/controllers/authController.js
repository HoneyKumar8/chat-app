const bcrypt = require("bcryptjs");

const { User } = require("../models");

const generateToken =
  require("../utils/generateToken");



/* =========================
   REGISTER
========================= */

exports.register = async (req, res) => {

  try {

    const {
      username,
      email,
      password
    } = req.body;

    const existingUser =
      await User.findOne({
        where: { email }
      });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        username,
        email,
        password: hashedPassword
      });

    res.status(201).json({

      token:
        generateToken(user.id),

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Register failed"
    });
  }
};



/* =========================
   LOGIN
========================= */

exports.login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        where: { email }
      });

    if (!user) {

      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    res.json({

      token:
        generateToken(user.id),

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });
  }
};