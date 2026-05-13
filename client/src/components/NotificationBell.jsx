import {
  Bell
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import {
  useSocket
} from "../context/SocketContext";

const NotificationBell = () => {

  const { socket } =
    useSocket();

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    unreadCount,
    setUnreadCount
  ] = useState(0);

  const [
    open,
    setOpen
  ] = useState(false);



  useEffect(() => {

    socket.on(
      "new_notification",
      (notification) => {

        setNotifications(
          (prev) => [
            notification,
            ...prev
          ]
        );

        setUnreadCount(
          (prev) => prev + 1
        );
      }
    );

    return () => {

      socket.off(
        "new_notification"
      );
    };

  }, [socket]);



  const toggleDropdown = () => {

    const next = !open;

    setOpen(next);

    if (next) {
      setUnreadCount(0);
    }
  };



  return (
    <div className="relative">

      <button
        onClick={toggleDropdown}
        className="
        relative
        p-2
        rounded-xl
        hover:bg-slate-800
        transition-all
      "
      >

        <Bell size={24} />

        {unreadCount > 0 && (

          <span
            className="
            absolute
            -top-1
            -right-1
            min-w-[20px]
            h-5
            px-1
            rounded-full
            bg-red-500
            text-[10px]
            font-bold
            flex
            items-center
            justify-center
          "
          >
            {unreadCount}
          </span>

        )}

      </button>



      {open && (

        <div
          className="
          absolute
          right-4
          mt-3
          w-[360px]
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          shadow-2xl
          overflow-hidden
          z-50
        "
        >

          <div
            className="
            px-5
            py-4
            border-b
            border-slate-800
            font-semibold
          "
          >
            Notifications
          </div>

          <div
            className="
            max-h-[400px]
            overflow-y-auto
          "
          >

            {notifications.length === 0 ? (

              <div
                className="
                p-5
                text-sm
                text-slate-400
              "
              >
                No notifications
              </div>

            ) : (

              notifications.map(
                (
                  notification,
                  index
                ) => (

                  <div
                    key={index}
                    className="
                    px-5
                    py-4
                    border-b
                    border-slate-800
                    text-sm
                  "
                  >
                    {
                      notification.message
                    }
                  </div>

                )
              )

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default NotificationBell;