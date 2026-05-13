const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes =
  require("./routes/authRoutes");

const roomRoutes =
  require("./routes/roomRoutes");

const conversationRoutes =
  require("./routes/conversationRoutes");

const messageRoutes =
  require("./routes/messageRoutes");

const userRoutes =
  require("./routes/userRoutes");

const uploadRoutes =
  require("./routes/uploadRoutes");

const errorMiddleware =
  require("./middleware/errorMiddleware");

const app = express();



/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);



/* =========================
   STATIC FILES
========================= */

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "../uploads"
    )
  )
);



/* =========================
   ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/rooms",
  roomRoutes
);

app.use(
  "/api/conversations",
  conversationRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);



/* =========================
   ERROR HANDLER
========================= */

app.use(errorMiddleware);

module.exports = app;