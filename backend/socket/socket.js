import { Server } from "socket.io";
import http from "http";
import express from "express";

const app=express();

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:["http://localhost:3000"],
        methods : ["GET","POST"]
    }
});

export const getReciverSocketId = (receiverId)=>{
    return userSocketMap[receiverId]
}

const userSocketMap= {} // {userId:socketId}

export const userSockketMap = userSocketMap; 

io.on("connection",(socket)=>{
    console.log("a user connected",socket.id)

    const userId = socket.handshake.query.userId;
    if (userId != "undefined" ) userSocketMap[userId]=socket.id;

    // Make userSocketMap available on io for other modules
    io.userSocketMap = userSocketMap;

    // io.emit() is used to send the event to all the connected clients
    io.emit("get_online_users",Object.keys(userSocketMap))

    // Handle joining group chat rooms
    socket.on("joinGroup", (groupId) => {
        socket.join(`group:${groupId}`);
        console.log(`User ${userId} joined group ${groupId}`);
    });

    // Handle leaving group chat rooms
    socket.on("leaveGroup", (groupId) => {
        socket.leave(`group:${groupId}`);
        console.log(`User ${userId} left group ${groupId}`);
    });

    // socket.on is used to listen to the event.can be used to listen to the event from the client side 
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        delete userSocketMap[userId]
        io.emit("get_online_users",Object.keys(userSocketMap))
    })
})

export {app,io,server}