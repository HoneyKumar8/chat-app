import {
  useSocket
} from "../context/SocketContext";

const OnlineUsers = () => {

  const { onlineUsers } =
    useSocket();

  return (
    <div
      className="
      h-full
      bg-slate-900
      border
      border-slate-800
      rounded-3xl
      p-4
      overflow-y-auto
    "
    >

      <h2
        className="
        text-xl
        font-bold
        mb-5
      "
      >
        Online Users
      </h2>

      <div
        className="
        flex
        flex-col
        gap-3
      "
      >

        {onlineUsers.length === 0 && (

          <div
            className="
            text-sm
            text-slate-400
          "
          >
            No users online
          </div>

        )}

        {onlineUsers.map(
          (userId) => (

            <div
              key={userId}
              className="
              bg-slate-800
              border
              border-slate-700
              rounded-2xl
              px-4
              py-3
              flex
              items-center
              gap-3
            "
            >

              <div
                className="
                w-3
                h-3
                rounded-full
                bg-green-500
              "
              />

              <span>
                User {userId}
              </span>

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default OnlineUsers;