const express = require("express");

const router =
  express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getRoomMessages,
  editMessage,
  deleteMessage
} = require(
  "../controllers/messageController"
);



router.get(
  "/room/:roomId",
  authMiddleware,
  getRoomMessages
);



router.put(
  "/:id",
  authMiddleware,
  editMessage
);



router.delete(
  "/:id",
  authMiddleware,
  deleteMessage
);



module.exports = router;