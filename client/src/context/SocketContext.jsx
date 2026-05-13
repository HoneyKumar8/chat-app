import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import socket from "../socket/socket";

import {
  useAuth
} from "./AuthContext";

const SocketContext =
  createContext();



export const SocketProvider = ({
  children
}) => {

  const { user } =
    useAuth();

  const [
    onlineUsers,
    setOnlineUsers
  ] = useState([]);




  /* =========================
     ONLINE USERS
  ========================= */

  useEffect(() => {

  if (!user) return;

  socket.emit(
    "user_online",
    user.id
  );

  const handleOnlineUsers =
    (users) => {

      setOnlineUsers(users);
    };

  socket.on(
    "online_users",
    handleOnlineUsers
  );

  return () => {

    socket.off(
      "online_users",
      handleOnlineUsers
    );
  };

}, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers
      }}
    >

      {children}

    </SocketContext.Provider>
  );
};



export const useSocket = () =>
  useContext(SocketContext);