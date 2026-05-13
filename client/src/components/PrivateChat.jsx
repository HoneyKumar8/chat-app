import {
  useEffect,
  useRef,
  useState
} from "react";

import API from "../api/axios";

import {
  useSocket
} from "../context/SocketContext";

import {
  useAuth
} from "../context/AuthContext";

import MessageBubble from "./MessageBubble";

import MessageInput from "./MessageInput";

const PrivateChat = ({
  selectedConversation,
  setUnreadDMs
}) => {

  const { socket } =
    useSocket();

  const { user } =
    useAuth();

  const [messages, setMessages] =
    useState([]);

  const [typingUser, setTypingUser] =
    useState("");

  const [seen, setSeen] =
    useState(false);

  const bottomRef =
    useRef(null);



  useEffect(() => {

    if (!selectedConversation)
      return;

    fetchMessages();

    socket.emit(
      "join_room",
      selectedConversation.id
    );

  }, [selectedConversation]);



  useEffect(() => {

    socket.on(
      "receive_private_message",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message
        ]);

        if (
          message.conversationId !==
          selectedConversation?.id
        ) {

          setUnreadDMs(
            (prev) => ({
              ...prev,
              [message.conversationId]:
                (
                  prev[
                    message.conversationId
                  ] || 0
                ) + 1
            })
          );
        }
      }
    );



    socket.on(
      "dm_typing",
      (data) => {

        setTypingUser(
          data.username
        );
      }
    );

      socket.on(
  "message_deleted",
  ({ id }) => {

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              content:
                "Message deleted",
              isDeleted: true
            }
          : msg
      )
    );
  }
);



socket.on(
  "message_edited",
  (updatedMessage) => {

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === updatedMessage.id
          ? updatedMessage
          : msg
      )
    );
  }
);

    socket.on(
      "dm_stop_typing",
      () => {

        setTypingUser("");
      }
    );



    return () => {

      socket.off(
        "receive_private_message"
      );

      socket.off(
        "dm_typing"
      );

      socket.off(
        "dm_stop_typing"
      );

      socket.off("message_deleted");
socket.off("message_edited");
    };

  }, [socket,
  selectedConversation]);



  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior: "smooth"
      });

  }, [messages]);



  const fetchMessages =
    async () => {

      try {

        const { data } =
          await API.get(
            `/conversations/${selectedConversation.id}/messages`
          );

        setMessages(data);

      } catch (error) {

        console.log(error);
      }
    };



  const sendMessage = (
    content,
    uploadedFile
  ) => {

    socket.emit(
      "send_private_message",
      {
        content,
        senderId: user.id,
        conversationId:
          selectedConversation.id,
        fileUrl:
          uploadedFile?.fileUrl,
        fileType:
          uploadedFile?.fileType
      }
    );
  };



  if (!selectedConversation) {

    return (
      <div
        className="
        flex-1
        flex
        items-center
        justify-center
        text-2xl
        text-slate-500
      "
      >
        Select a conversation
      </div>
    );
  }



  return (
    <div
      className="
      flex-1
      flex
      flex-col
      bg-[#020817]
    "
    >

      {/* HEADER */}

      <div
        className="
        sticky
        top-0
        z-20
        bg-[#020817]/95
        backdrop-blur-xl
        border-b
        border-slate-800
        px-6
        py-5
      "
      >

        <div
          className="
          text-3xl
          font-bold
        "
        >
          Direct Message
        </div>

      </div>



      {/* MESSAGES */}

      <div
        className="
        flex-1
        overflow-y-auto
        px-4
        md:px-8
        py-6
        flex
        flex-col
        gap-7
      "
      >

        {messages.map(
          (message) => (

            <MessageBubble
              key={message.id}
              message={message}
              currentUser={user}
              socket={socket}
            />

          )
        )}

        {typingUser && (

          <div
            className="
            text-sm
            text-slate-400
            italic
          "
          >
            {typingUser} is typing...
          </div>

        )}

        {messages.length > 0 &&
          seen && (

          <div
            className="
            text-xs
            text-right
            text-slate-400
          "
          >
            Seen
          </div>

        )}

        <div ref={bottomRef} />

      </div>



      {/* INPUT */}

      <div
        className="
        px-4
        md:px-6
        py-4
        border-t
        border-slate-800
      "
      >

        <MessageInput
          sendMessage={sendMessage}
          socket={socket}
          selectedRoom={{
            id:
              selectedConversation.id,
            isDM: true
          }}
          user={user}
        />

      </div>

    </div>
  );
};

export default PrivateChat;