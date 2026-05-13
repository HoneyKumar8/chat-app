import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../api/axios";

import {
  useAuth
} from "../context/AuthContext";

const Sidebar = ({
  selectedRoom,
  setSelectedRoom,
  selectedConversation,
  setSelectedConversation,
  unreadRooms,
  setUnreadRooms,
  unreadDMs,
  setUnreadDMs
}) => {

  const { logout, user } =
    useAuth();

  const navigate =
    useNavigate();

  const [rooms, setRooms] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [roomName, setRoomName] =
    useState("");

  const [
    roomSearch,
    setRoomSearch
  ] = useState("");

  const [
    userSearch,
    setUserSearch
  ] = useState("");



  useEffect(() => {

    fetchRooms();

    if (user) {
      fetchUsers();
    }

  }, [user]);



  const fetchRooms =
    async () => {

      try {

        const { data } =
          await API.get("/rooms");

        setRooms(data);

      } catch (error) {

        console.log(error);
      }
    };



  const fetchUsers =
    async () => {

      try {

        const { data } =
          await API.get("/users");

        setUsers(
          data.filter(
            (u) =>
              u.id !== user.id
          )
        );

      } catch (error) {

        console.log(error);
      }
    };



  const createRoom =
    async () => {

      if (!roomName.trim())
        return;

      try {

        await API.post(
          "/rooms",
          {
            name: roomName
          }
        );

        setRoomName("");

        fetchRooms();

      } catch (error) {

        console.log(error);
      }
    };



  const startConversation =
    async (selectedUser) => {

      try {

        const { data } =
          await API.post(
            "/conversations",
            {
              userId:
                selectedUser.id
            }
          );

        selectedUser.conversationId =
          data.id;

        setUnreadDMs(
          (prev) => ({
            ...prev,
            [data.id]: 0
          })
        );

        setSelectedConversation(
          data
        );

        setSelectedRoom(null);

        localStorage.setItem(
          "selectedConversation",
          JSON.stringify(data)
        );

        localStorage.removeItem(
          "selectedRoom"
        );

      } catch (error) {

        console.log(error);
      }
    };



  const filteredRooms =
    rooms.filter((room) =>
      room.name
        .toLowerCase()
        .includes(
          roomSearch.toLowerCase()
        )
    );



  const filteredUsers =
    users.filter((u) =>
      u.username
        .toLowerCase()
        .includes(
          userSearch.toLowerCase()
        )
    );



  return (
    <div
      className="
      h-full
      bg-slate-900
      rounded-3xl
      border
      border-slate-800
      p-5
      flex
      flex-col
      gap-5
      overflow-y-auto
      shadow-2xl
    "
    >

      {/* HEADER */}

      <div>

        <h1
          className="
          text-2xl
          font-bold
          mb-5
        "
        >
          Rooms
        </h1>

        <div
          className="
          flex
          gap-2
        "
        >

          <input
            type="text"
            placeholder="New room"
            value={roomName}
            onChange={(e) =>
              setRoomName(
                e.target.value
              )
            }
            className="
            flex-1
            bg-slate-800
            border
            border-slate-700
            rounded-2xl
            px-4
            py-3
            outline-none
            focus:border-blue-500
          "
          />

          <button
            onClick={createRoom}
            className="
            bg-blue-600
            hover:bg-blue-700
            rounded-2xl
            px-4
            font-bold
          "
          >
            +
          </button>

        </div>

      </div>



      {/* ROOM SEARCH */}

      <input
        type="text"
        placeholder="Search rooms..."
        value={roomSearch}
        onChange={(e) =>
          setRoomSearch(
            e.target.value
          )
        }
        className="
        bg-slate-800
        border
        border-slate-700
        rounded-2xl
        px-4
        py-3
        outline-none
        focus:border-blue-500
      "
      />



      {/* ROOM LIST */}

      <div
        className="
        flex
        flex-col
        gap-3
      "
      >

        {filteredRooms.map(
          (room) => (

            <button
              key={room.id}
              onClick={() => {

                setSelectedRoom(room);

                setSelectedConversation(
                  null
                );

                setUnreadRooms(
                  (prev) => ({
                    ...prev,
                    [room.id]: 0
                  })
                );

                localStorage.setItem(
                  "selectedRoom",
                  JSON.stringify(room)
                );

                localStorage.removeItem(
                  "selectedConversation"
                );
              }}
              className={`
                rounded-2xl
                p-4
                text-left
                transition-all
                border
                ${
                  selectedRoom?.id === room.id
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-800 border-slate-700 hover:border-slate-500"
                }
              `}
            >

              <div
                className="
                flex
                items-start
                justify-between
                gap-3
              "
              >

                <div
                  className="
                  flex-1
                  min-w-0
                "
                >

                  <div
                    className="
                    font-semibold
                    text-base
                    truncate
                  "
                  >
                    # {room.name}
                  </div>

                  {room.Messages?.[0] && (

                    <div
                      className="
                      text-xs
                      text-slate-300
                      mt-2
                      truncate
                    "
                    >
                      {
                        room.Messages[0]
                          .User?.username
                      }
                      :
                      {" "}
                      {
                        room.Messages[0]
                          .content
                      }
                    </div>

                  )}

                </div>

                {unreadRooms?.[
                  room.id
                ] > 0 && (

                  <div
                    className="
                    min-w-[24px]
                    h-6
                    px-2
                    rounded-full
                    bg-red-500
                    text-xs
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                  >
                    {
                      unreadRooms[
                        room.id
                      ]
                    }
                  </div>

                )}

              </div>

            </button>

          )
        )}

      </div>



      {/* DMS */}

      <div className="pt-3">

        <h2
          className="
          text-2xl
          font-bold
          mb-4
        "
        >
          Direct Messages
        </h2>

        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) =>
            setUserSearch(
              e.target.value
            )
          }
          className="
          w-full
          bg-slate-800
          border
          border-slate-700
          rounded-2xl
          px-4
          py-3
          outline-none
          focus:border-blue-500
          mb-4
        "
        />

        <div
          className="
          flex
          flex-col
          gap-3
        "
        >

          {filteredUsers.map(
            (u) => (

              <button
                key={u.id}
                onClick={() =>
                  startConversation(
                    u
                  )
                }
                className="
                bg-slate-800
                border
                border-slate-700
                hover:border-slate-500
                rounded-2xl
                px-4
                py-3
                flex
                items-center
                justify-between
                transition-all
              "
              >

                <div
                  className="
                  flex
                  items-center
                  gap-3
                "
                >

                  <div
                    className={`
                      w-3
                      h-3
                      rounded-full
                      ${
                        u.status ===
                        "online"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }
                    `}
                  />

                  <span>
                    {u.username}
                  </span>

                </div>

                {unreadDMs?.[
                  u.conversationId
                ] > 0 && (

                  <div
                    className="
                    min-w-[24px]
                    h-6
                    px-2
                    rounded-full
                    bg-red-500
                    text-xs
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                  >
                    {
                      unreadDMs[
                        u.conversationId
                      ]
                    }
                  </div>

                )}

              </button>

            )
          )}

        </div>

      </div>



      {/* LOGOUT */}

      <button
        onClick={() => {

          logout();

          navigate("/login");
        }}
        className="
        mt-auto
        bg-red-600
        hover:bg-red-700
        rounded-2xl
        py-3
        font-semibold
        transition-all
      "
      >
        Logout
      </button>

    </div>
  );
};

export default Sidebar;