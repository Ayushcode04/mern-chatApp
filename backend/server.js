import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connecToMOngoDB from "./db/connectTOMongoDB.js";

const app=express();
const PORT=process.env.PORT || 5000;


 
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);


app.listen(PORT,()=>{
    connecToMOngoDB()
    console.log(`server running on ${PORT}`)
});