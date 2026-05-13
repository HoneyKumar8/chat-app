const {
  Message,
  User,
  ReadReceipt
} = require("../models");



/* =========================
   ONLINE USERS
========================= */

const onlineUsers = {};



/* =========================
   NOTIFICATIONS
========================= */

const notificationStore = {};



module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected");



    /* =========================
       USER ONLINE
    ========================= */

    socket.on(
      "user_online",
      async (userId) => {

        try {

          onlineUsers[userId] =
            socket.id;

          await User.update(
            {
              status: "online"
            },
            {
              where: { id: userId }
            }
          );

          io.emit(
            "online_users",
            Object.keys(onlineUsers)
          );

        } catch (error) {

          console.error(error);
        }
      }
    );



    /* =========================
       JOIN ROOM
    ========================= */

    socket.on(
      "join_room",
      (roomId) => {

        socket.join(
          roomId.toString()
        );

        console.log(
          `Joined room ${roomId}`
        );
      }
    );



    /* =========================
       ROOM MESSAGE
    ========================= */

    socket.on(
      "send_room_message",
      async (data) => {

        try {

          const message =
            await Message.create({

              content:
                data.content,

              senderId:
                data.senderId,

              roomId:
                data.roomId,

              fileUrl:
                data.fileUrl,

              fileType:
                data.fileType
            });

          const fullMessage =
            await Message.findByPk(
              message.id,
              {
                include: User
              }
            );



          /* =========================
             HANDLE MENTIONS
          ========================= */

          const mentionMatches =
            data.content?.match(
              /@(\w+)/g
            );

          if (mentionMatches) {

            for (const mention of mentionMatches) {

              const username =
                mention.replace("@", "");

              const mentionedUser =
                await User.findOne({
                  where: { username }
                });

              if (
                mentionedUser &&
                onlineUsers[
                  mentionedUser.id
                ]
              ) {

                const notification = {

                  type: "mention",

                  message:
                    `${data.senderName} mentioned you in #${data.roomName}`,

                  roomId:
                    data.roomId,

                  createdAt:
                    new Date()
                };

                if (
                  !notificationStore[
                    mentionedUser.id
                  ]
                ) {

                  notificationStore[
                    mentionedUser.id
                  ] = [];
                }

                notificationStore[
                  mentionedUser.id
                ].push(notification);

                io.to(
                  onlineUsers[
                    mentionedUser.id
                  ]
                ).emit(
                  "new_notification",
                  notification
                );
              }
            }
          }



          io.to(
            data.roomId.toString()
          ).emit(
            "receive_room_message",
            fullMessage
          );

        } catch (error) {

          console.error(error);
        }
      }
    );



    /* =========================
       PRIVATE MESSAGE
    ========================= */

    socket.on(
      "send_private_message",
      async (data) => {

        try {

          const message =
            await Message.create({

              content:
                data.content,

              senderId:
                data.senderId,

              conversationId:
                data.conversationId,

              fileUrl:
                data.fileUrl,

              fileType:
                data.fileType
            });

          const fullMessage =
            await Message.findByPk(
              message.id,
              {
                include: User
              }
            );

          io.to(
            data.conversationId.toString()
          ).emit(
            "receive_private_message",
            fullMessage
          );

        } catch (error) {

          console.error(error);
        }
      }
    );



    /* =========================
       READ RECEIPTS
    ========================= */

    socket.on(
      "mark_messages_read",
      async (data) => {

        try {

          const messages =
            await Message.findAll({

              where: {
                conversationId:
                  data.conversationId
              }
            });

          for (const message of messages) {

            const existingReceipt =
              await ReadReceipt.findOne({

                where: {

                  messageId:
                    message.id,

                  userId:
                    data.userId
                }
              });

            if (!existingReceipt) {

              await ReadReceipt.create({

                messageId:
                  message.id,

                userId:
                  data.userId
              });
            }
          }

          io.to(
            data.conversationId.toString()
          ).emit(
            "messages_seen",
            {

              conversationId:
                data.conversationId,

              userId:
                data.userId
            }
          );

        } catch (error) {

          console.error(error);
        }
      }
    );



    /* =========================
       EDIT MESSAGE
    ========================= */

    socket.on(
      "edit_message",
      async (data) => {

        try {

          const message =
            await Message.findByPk(
              data.messageId
            );

          if (!message) return;

          message.content =
            data.content;

          message.isEdited = true;

          await message.save();

          const updatedMessage =
            await Message.findByPk(
              message.id,
              {
                include: User
              }
            );

          io.emit(
            "message_edited",
            updatedMessage
          );

        } catch (error) {

          console.error(error);
        }
      }
    );



    /* =========================
       DELETE MESSAGE
    ========================= */

    socket.on(
      "delete_message",
      async (data) => {

        try {

          const message =
            await Message.findByPk(
              data.messageId
            );

          if (!message) return;

          message.content =
            "Message deleted";

          message.isDeleted = true;

          await message.save();

          io.emit(
            "message_deleted",
            {
              id: message.id
            }
          );

        } catch (error) {

          console.error(error);
        }
      }
    );



    /* =========================
       ROOM TYPING
    ========================= */

    socket.on(
      "room_typing",
      (data) => {

        socket.to(
          data.roomId.toString()
        ).emit(
          "room_typing",
          data
        );
      }
    );



    socket.on(
      "room_stop_typing",
      (data) => {

        socket.to(
          data.roomId.toString()
        ).emit(
          "room_stop_typing",
          data
        );
      }
    );



    /* =========================
       DM TYPING
    ========================= */

    socket.on(
      "dm_typing",
      (data) => {

        socket.to(
          data.conversationId.toString()
        ).emit(
          "dm_typing",
          data
        );
      }
    );



    socket.on(
      "dm_stop_typing",
      (data) => {

        socket.to(
          data.conversationId.toString()
        ).emit(
          "dm_stop_typing",
          data
        );
      }
    );



    /* =========================
       DISCONNECT
    ========================= */

    socket.on(
      "disconnect",
      async () => {

        try {

          const disconnectedUser =
            Object.keys(onlineUsers)
              .find(
                (key) =>
                  onlineUsers[key] ===
                  socket.id
              );

          if (disconnectedUser) {

            delete onlineUsers[
              disconnectedUser
            ];

            await User.update(
              {
                status: "offline"
              },
              {
                where: {
                  id:
                    disconnectedUser
                }
              }
            );

            io.emit(
              "online_users",
              Object.keys(onlineUsers)
            );
          }

          console.log(
            "User disconnected"
          );

        } catch (error) {

          console.error(error);
        }
      }
    );
  });
};