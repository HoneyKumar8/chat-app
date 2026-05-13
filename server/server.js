require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");

const sequelize =
  require("./src/config/database");

require("./src/models");

const socketHandler =
  require("./src/sockets/socketHandler");

const PORT =
  process.env.PORT || 5000;



/* =========================
   CREATE SERVER
========================= */

const server =
  http.createServer(app);



/* =========================
   SOCKET IO
========================= */

const io = new Server(server, {

  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"]
  }
});

socketHandler(io);



/* =========================
   DATABASE + SERVER START
========================= */

sequelize.sync()

  .then(() => {

    if (
      process.env.NODE_ENV !== "test"
    ) {

      console.log(
        "Database connected"
      );

      server.listen(PORT, () => {

        console.log(
          `Server running on port ${PORT}`
        );
      });
    }
  })

  .catch((error) => {

    console.error(error);
  });

module.exports = app;