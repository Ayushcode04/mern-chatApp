// frontend/src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("https://chat-app-production-7st5.onrender.com", {
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(socket);

            // Listen for online users
            socket.on("get_online_users", (users) => {
                setOnlineUsers(users);
            });

            // Listen for group events (optional additional functionality)
            socket.on("group_updated", (data) => {
                // You could trigger a refetch of groups or update UI here
                console.log("Group updated:", data);
            });

            socket.on("group_deleted", (groupId) => {
                // You could handle removing the group from state here
                console.log("Group deleted:", groupId);
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);
        
    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};