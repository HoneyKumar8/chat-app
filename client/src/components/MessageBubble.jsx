import {
  Pencil,
  Trash2,
  Check,
  X
} from "lucide-react";

import {
  useState
} from "react";

import API from "../api/axios";

const MessageBubble = ({
  message,
  currentUser,
  socket
}) => {

  const isOwnMessage =
    message.senderId ===
    currentUser.id;

  const [editing, setEditing] =
    useState(false);

  const [editedText, setEditedText] =
    useState(message.content);



  const handleEdit =
    async () => {

      try {

        const { data } =
          await API.put(
            `/messages/${message.id}`,
            {
              content:
                editedText
            }
          );

        socket.emit(
  "edit_message",
  {
    messageId: message.id,
    content: editedText
  }
);

        setEditing(false);

      } catch (error) {

        console.log(error);
      }
    };



  const handleDelete =
    async () => {

      try {

        await API.delete(
          `/messages/${message.id}`
        );

        socket.emit(
          "delete_message",
          {
            messageId: message.id
          }
        );

      } catch (error) {

        console.log(error);
      }
    };



  return (
    <div
      className={`
        
        flex
        ${isOwnMessage
          ? "justify-end"
          : "justify-start"}
      `}
    >

      <div
        className="
        flex
        items-start
        gap-2
        max-w-[75%]
min-w-0
break-words
overflow-hidden
      "
      >

        {/* ACTIONS */}

        {isOwnMessage && (

          <div
            className="
            flex
            gap-2
            pt-2
            shrink-0
          "
          >

            <button
              onClick={() =>
                setEditing(
                  !editing
                )
              }
              className="
              text-slate-400
              hover:text-white
            "
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={handleDelete}
              className="
              text-red-400
              hover:text-red-300
            "
            >
              <Trash2 size={16} />
            </button>

          </div>

        )}



        {/* BUBBLE */}

        <div
          className={`
            rounded-xl
            px-5
            py-4
            break-words
            overflow-hidden
            min-w-0
            shadow-lg
            ${
              isOwnMessage
                ? "bg-blue-600"
                : "bg-slate-800 border border-slate-700"
            }
          `}
        >

          {/* USERNAME */}

          <div
            className="
            text-xs
            uppercase
            tracking-widest
            font-bold
            opacity-80
            mb-2
          "
          >
            {
              message.User
                ?.username
            }
          </div>



          {/* EDIT MODE */}

          {editing ? (

            <div
              className="
              flex
              flex-col
              gap-3
            "
            >

              <textarea
                value={editedText}
                onChange={(e) =>
                  setEditedText(
                    e.target.value
                  )
                }
                className="
                bg-slate-900
                border
                border-slate-600
                rounded-2xl
                p-3
                outline-none
                resize-none
                min-h-[100px]
              "
              />

              <div
                className="
                flex
                gap-3
              "
              >

                <button
                  onClick={handleEdit}
                  className="
                  bg-green-600
                  hover:bg-green-700
                  p-2
                  rounded-xl
                "
                >
                  <Check size={18} />
                </button>

                <button
                  onClick={() =>
                    setEditing(false)
                  }
                  className="
                  bg-red-600
                  hover:bg-red-700
                  p-2
                  rounded-xl
                "
                >
                  <X size={18} />
                </button>

              </div>

            </div>

          ) : (

            <>
              {/* TEXT */}

              <div
                className="
                whitespace-pre-wrap
                break-words
                text-[16px]
                leading-7
              "
              >
                {
                  message.isDeleted
                    ? "Message deleted"
                    : message.content
                }
              </div>



              {/* FILE */}

              {message.fileUrl && (

                <div className="mt-4">

                  {message.fileType?.startsWith(
                    "image"
                  ) ? (

                    <img
                      src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${message.fileUrl}`}
                      alt="media"
                      className="
                      rounded-2xl
                      max-w-full
                    "
                    />

                  ) : message.fileType?.startsWith(
                    "video"
                  ) ? (

                    <video
                      controls
                      className="
                      rounded-2xl
                      max-w-full
                    "
                    >
                      <source
                        src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${message.fileUrl}`}
                      />
                    </video>

                  ) : (

                    <a
                      href={`${import.meta.env.VITE_API_URL.replace("/api", "")}${message.fileUrl}`}
                      target="_blank"
                      className="
                      text-cyan-300
                      underline
                    "
                    >
                      Open File
                    </a>

                  )}

                </div>

              )}



              {/* FOOTER */}

              <div
                className="
                flex
                justify-end
                gap-2
                mt-3
                text-xs
                opacity-70
              "
              >

                {message.isEdited &&
                  !message.isDeleted && (
                  <span>
                    edited
                  </span>
                )}

                <span>
                  {new Date(
                    message.createdAt
                  ).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute:
                        "2-digit"
                    }
                  )}
                </span>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
};

export default MessageBubble;