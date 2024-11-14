import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io'; 
 
import app from './app.js'; 
import './models/User.js'; 
import './models/Chatroom.js';
import './models/Message.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('Mongoose Connection ERROR: ' + err.message));

// Create HTTP server and set up Socket.io
const server = createServer(app);
const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Bring in mongoose models for socket events
import Message from './models/Message.js';
import User from './models/User.js';

// Authenticate socket connection using JWT
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
  }
});

// Set up socket event listeners
io.on('connection', (socket) => {
  console.log('Connected:', socket.userId);

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.userId);
  });

  socket.on('joinRoom', ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log('A user joined chatroom:', chatroomId);
  });

  socket.on('leaveRoom', ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log('A user left chatroom:', chatroomId);
  });

  socket.on('chatroomMessage', async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      });
      io.to(chatroomId).emit('newMessage', {
        message,
        name: user.name,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
