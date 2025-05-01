import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) return;

    const socketInstance = io("/", {
      path: "/socket.io",
      query: { userId: authUser._id },
    });

    socketInstance.on("connect", () => {
      console.log("🔌 Socket connected:", socketInstance.id);
    });
    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });
    socketInstance.on("get_online_users", setOnlineUsers);

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};