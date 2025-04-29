import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connecToMOngoDB from "./db/connectTOMongoDB.js";
import { app, server } from "./socket/socket.js";
import groupRoutes from "./routes/group.routes.js"
import groupMessageRoutes from "./routes/groupMessage.routes.js"


const PORT=process.env.PORT || 5000;

const __dirname = path.resolve();


 
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);
app.use("/api/groups",groupRoutes);
app.use("/api/group-messages",groupMessageRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
})

server.listen(PORT,()=>{
    connecToMOngoDB()
    console.log(`server running on ${PORT}`)
});