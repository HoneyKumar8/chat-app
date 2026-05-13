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

import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({
  selectedRoom,
  setUnreadRooms
}) => {

  const { socket } =
    useSocket();

  const { user } =
    useAuth();

  const [messages, setMessages] =
    useState([]);

  const [typingUser, setTypingUser] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  const bottomRef = useRef(null);




  useEffect(() => {

    if (!selectedRoom)
      return;

    setPage(1);

    setHasMore(true);

    fetchMessages(1);

    socket.emit(
      "join_room",
      selectedRoom.id
    );

  }, [selectedRoom]);




  useEffect(() => {

    socket.on(
      "receive_room_message",
      (message) => {

        setMessages((prev) => [
          ...prev,
          message
        ]);

        if (
          message.roomId ===
          selectedRoom?.id
        ) {

          setUnreadRooms(
            (prev) => ({
              ...prev,
              [message.roomId]: 0
            })
          );

        } else {

          setUnreadRooms(
            (prev) => ({
              ...prev,
              [message.roomId]:
                (
                  prev[
                    message.roomId
                  ] || 0
                ) + 1
            })
          );
        }
      }
    );



    socket.on(
      "room_typing",
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
      "room_stop_typing",
      () => {

        setTypingUser("");
      }
    );



    return () => {

      socket.off(
        "receive_room_message"
      );

      socket.off(
        "room_typing"
      );

      socket.off(
        "room_stop_typing"
      );

      socket.off("message_deleted");
socket.off("message_edited");
    };

  }, [socket,
  selectedRoom]);




  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior: "smooth"
      });

  }, [messages]);




  const fetchMessages =
    async (
      pageNumber = 1,
      append = false
    ) => {

      try {

        const { data } =
          await API.get(
            `/messages/room/${selectedRoom.id}?page=${pageNumber}&limit=20`
          );

        if (data.length < 20) {

          setHasMore(false);
        }

        if (append) {

          setMessages((prev) => [
            ...data,
            ...prev
          ]);

        } else {

          setMessages(data);
        }

      } catch (error) {

        console.log(error);
      }
    };




  const sendMessage = (
    content,
    uploadedFile
  ) => {

    socket.emit(
      "send_room_message",
      {
        content,
        senderId: user.id,
        senderName:
          user.username,
        roomId:
          selectedRoom.id,
        roomName:
          selectedRoom.name,
        fileUrl:
          uploadedFile?.fileUrl,
        fileType:
          uploadedFile?.fileType
      }
    );
  };




  const filteredMessages =
    messages.filter((message) =>
      message.content
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );




  if (!selectedRoom) {

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
        Select a room
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
      min-w-0
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
        px-5
        md:px-8
        py-5
      "
      >

        <div
          className="
          flex
  justify-center
  px-6
  py-4
          text-3xl
          font-bold
          tracking-tight
          mb-4
        "
        >
          # {selectedRoom.name}
        </div>

        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
          flex
          justify-center
          w-full
          max-w-2xl
          md:max-w-md
          px-5
          py-3
          rounded-2xl
          bg-slate-900
          border
          border-slate-700
          outline-none
          focus:border-blue-500
          text-sm
        "
        />

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

        {hasMore && (

          <button
            onClick={() =>
              loadOlderMessages()
            }
            className="
            self-center
            bg-slate-800
            hover:bg-slate-700
            px-5
            py-2
            rounded-xl
            text-sm
          "
          >
            Load Older Messages
          </button>

        )}

        {filteredMessages.map(
          (message) => (

            <MessageBubble
              key={message.id}
              message={message}
              currentUser={user}
              socket={socket}
            />

          )
        )}

        <TypingIndicator
          typingUser={typingUser}
        />

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
        bg-[#020817]
      "
      >

        <MessageInput
          sendMessage={sendMessage}
          socket={socket}
          selectedRoom={selectedRoom}
          user={user}
        />

      </div>

    </div>
  );
};

export default ChatWindow;