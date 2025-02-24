import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connecToMOngoDB from "./db/connectTOMongoDB.js";
import { app, server } from "./socket/socket.js";


const PORT=process.env.PORT || 5000;


 
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);


server.listen(PORT,()=>{
    connecToMOngoDB()
    console.log(`server running on ${PORT}`)
});