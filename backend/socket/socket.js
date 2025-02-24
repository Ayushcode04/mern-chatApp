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
    return userSockketMap[receiverId]
}

const userSockketMap= {} // {userId:socketId}

io.on("connection",(socket)=>{
    console.log("a user connected",socket.id)

    const userId = socket.handshake.query.userId;
    if (userId != "undefined" ) userSockketMap[userId]=socket.id;

    // io.emit() is used to send the event to all the connected clients
    io.emit("get_online_users",Object.keys(userSockketMap))

    // socket.on is used to listen to the event.can be used to listen to the event from the client side 
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        delete userSockketMap[userId]
        io.emit("get_online_users",Object.keys(userSockketMap))
    })
})

export {app,io,server}