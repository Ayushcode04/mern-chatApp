import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://chat-app-production-7st5.onrender.com',
    methods: ['GET','POST'],
    credentials: true,
  }
});

// keep track of userId → socket.id
const userSocketMap = {};

/** allow controllers to look up a user’s socket */
export const getReciverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on('connection', (socket) => {
  console.log('⚡️ Socket connected:', socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  socket.on('joinGroup', ({ groupId }) => {
    socket.join(`group:${groupId}`);
    console.log(`Socket ${socket.id} joined room group:${groupId}`);
  });

  socket.on('leaveGroup', ({ groupId }) => {
    socket.leave(`group:${groupId}`);
    console.log(`Socket ${socket.id} left room group:${groupId}`);
  });

  io.emit('get_online_users', Object.keys(userSocketMap));

  socket.on('newMessage', ({ message, receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
    delete userSocketMap[userId];
    io.emit('get_online_users', Object.keys(userSocketMap));
  });
});

// now export io so controllers can emit to rooms too
export { app, server, io };
