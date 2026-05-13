const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createConversation,
  getConversationMessages
} = require(
  "../controllers/conversationController"
);

router.post(
  "/",
  authMiddleware,
  createConversation
);

router.get(
  "/:id/messages",
  authMiddleware,
  getConversationMessages
);

module.exports = router;