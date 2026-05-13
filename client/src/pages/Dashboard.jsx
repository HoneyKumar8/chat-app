import {
  useEffect,
  useState
} from "react";

import {
  Menu,
  Users
} from "lucide-react";

import Sidebar from "../components/Sidebar";

import ChatWindow from "../components/ChatWindow";

import PrivateChat from "../components/PrivateChat";

import OnlineUsers from "../components/OnlineUsers";

import NotificationBell
  from "../components/NotificationBell";

const Dashboard = () => {

  const [
    selectedRoom,
    setSelectedRoom
  ] = useState(null);

  const [
    selectedConversation,
    setSelectedConversation
  ] = useState(null);

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(false);

  const [
    usersOpen,
    setUsersOpen
  ] = useState(false);

  const [
    unreadRooms,
    setUnreadRooms
  ] = useState({});

  const [
    unreadDMs,
    setUnreadDMs
  ] = useState({});



  /* =========================
     RESTORE SAVED STATE
  ========================= */

  useEffect(() => {

    const savedRoom =
      localStorage.getItem(
        "selectedRoom"
      );

    const savedConversation =
      localStorage.getItem(
        "selectedConversation"
      );

    if (savedRoom) {

      setSelectedRoom(
        JSON.parse(savedRoom)
      );
    }

    if (savedConversation) {

      setSelectedConversation(
        JSON.parse(savedConversation)
      );
    }

  }, []);




  return (
    <div
      className="
      h-screen
      flex
      bg-[#020817]
      text-white
      overflow-hidden
    "
    >

      {/* MOBILE HEADER */}

      <div
        className="
        md:hidden
        fixed
        top-0
        left-0
        right-0
        h-[72px]
        z-50
        bg-slate-900/95
        backdrop-blur-xl
        border-b
        border-slate-800
        flex
        items-center
        justify-between
        px-5
      "
      >

        <button
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
        >
          <Menu size={26} />
        </button>

        <h1
          className="
          text-xl
          font-bold
        "
        >
          CoderVibes
        </h1>

        <div
          className="
          flex
          items-center
          gap-4
        "
        >

          <NotificationBell />

          <button
            onClick={() =>
              setUsersOpen(
                !usersOpen
              )
            }
          >
            <Users size={25} />
          </button>

        </div>

      </div>



      {/* SIDEBAR */}

      <div
        className={`
          fixed
          md:relative
          z-40
          top-0
          left-0
          h-full
          w-[280px]
          bg-slate-950
          border-r
          border-slate-800
          transition-transform
          duration-300
          px-4
          py-4
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >

        <Sidebar
          selectedRoom={selectedRoom}
          setSelectedRoom={
            setSelectedRoom
          }
          selectedConversation={
            selectedConversation
          }
          setSelectedConversation={
            setSelectedConversation
          }
          unreadRooms={
            unreadRooms
          }
          setUnreadRooms={
            setUnreadRooms
          }
          unreadDMs={
            unreadDMs
          }
          setUnreadDMs={
            setUnreadDMs
          }
        />

      </div>



      {/* MAIN AREA */}

      <div
        className="
        flex-1
        flex
        min-w-0
        pt-[72px]
        md:pt-0
      "
      >

        {/* ROOM CHAT */}

        <div
          className={`
            flex-1
            min-w-0
            ${
              selectedConversation
                ? "hidden"
                : "flex"
            }
          `}
        >

          <ChatWindow
            selectedRoom={
              selectedRoom
            }
            setUnreadRooms={
              setUnreadRooms
            }
          />

        </div>



        {/* PRIVATE CHAT */}

        <div
          className={`
            flex-1
            min-w-0
            ${
              selectedConversation
                ? "flex"
                : "hidden"
            }
          `}
        >

          <PrivateChat
            selectedConversation={
              selectedConversation
            }
            setUnreadDMs={
              setUnreadDMs
            }
          />

        </div>

      </div>



      {/* DESKTOP NOTIFICATION */}

      <div
        className="
        hidden
        md:flex
        absolute
        top-5
        right-[240px]
        z-50
      "
      >
        <NotificationBell />
      </div>



      {/* ONLINE USERS */}

      <div
        className={`
          fixed
          md:relative
          top-0
          right-0
          h-full
          z-40
          w-[220px]
          bg-slate-950
          border-l
          border-slate-800
          transition-transform
          duration-300
          px-3
          py-4
          ${
            usersOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
          md:translate-x-0
        `}
      >

        <OnlineUsers />

      </div>



      {/* MOBILE OVERLAY */}

      {(sidebarOpen ||
        usersOpen) && (

        <div
          onClick={() => {

            setSidebarOpen(
              false
            );

            setUsersOpen(
              false
            );
          }}
          className="
          fixed
          inset-0
          bg-black/60
          z-30
          md:hidden
        "
        />

      )}

    </div>
  );
};

export default Dashboard;