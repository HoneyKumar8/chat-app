const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createRoom,
  getRooms
} = require("../controllers/roomController");

router.post("/", authMiddleware, createRoom);

router.get("/", authMiddleware, getRooms);

module.exports = router;