import {
  useState
} from "react";

import API from "../api/axios";

import {
  Send,
  Paperclip
} from "lucide-react";

const MessageInput = ({
  sendMessage,
  socket,
  selectedRoom,
  user
}) => {

  const [message, setMessage] =
    useState("");

  const [
    selectedFile,
    setSelectedFile
  ] = useState(null);



  /* =========================
     TYPING
  ========================= */

  const handleTyping = () => {

    if (selectedRoom?.isDM) {

      socket.emit(
        "dm_typing",
        {
          conversationId:
            selectedRoom.id,
          username:
            user.username
        }
      );

    } else {

      socket.emit(
        "room_typing",
        {
          roomId:
            selectedRoom.id,
          username:
            user.username
        }
      );
    }

    setTimeout(() => {

      if (selectedRoom?.isDM) {

        socket.emit(
          "dm_stop_typing",
          {
            conversationId:
              selectedRoom.id
          }
        );

      } else {

        socket.emit(
          "room_stop_typing",
          {
            roomId:
              selectedRoom.id
          }
        );
      }

    }, 1000);
  };



  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        !message.trim() &&
        !selectedFile
      ) return;

      let uploadedFile = null;

      if (selectedFile) {

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        const { data } =
          await API.post(
            "/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }
          );

        uploadedFile = data;
      }

      sendMessage(
        message,
        uploadedFile
      );

      setMessage("");

      setSelectedFile(null);
    };



  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >

      <div
        className="
        flex
        items-center
        gap-3
        bg-slate-900
        border
        border-slate-700
        rounded-[28px]
        px-5
        py-5
        shadow-xl
      "
      >

        <label
          className="
          cursor-pointer
          p-3
          rounded-2xl
          bg-slate-800
          hover:bg-slate-700
          transition-all
        "
        >

          <Paperclip size={18} />

          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              setSelectedFile(
                e.target.files[0]
              )
            }
          />

        </label>

        <input
          type="text"
          value={message}
          onChange={(e) => {

            setMessage(
              e.target.value
            );

            handleTyping();
          }}
          placeholder="Type a message..."
          className="
          text-lg
          flex-1
          bg-transparent
          outline-none
          text-white
          placeholder:text-slate-400
        "
        />

        <button
          className="
          bg-blue-600
          hover:bg-blue-700
          p-4
          rounded-2xl
          transition-all
          shadow-lg
        "
        >
          <Send size={18} />
        </button>

      </div>

      {selectedFile && (

        <div
          className="
          text-sm
          text-slate-400
          mt-2
          px-2
        "
        >
          Selected:
          {" "}
          {selectedFile.name}
        </div>

      )}

    </form>
  );
};

export default MessageInput;