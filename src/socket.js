// socket.js
import { Server } from 'socket.io';
import Message from './models/Message.js';
import logger from './logger/logger.js';
import AuthService from './services/auth.service.js';

const setupSocket = (server) => {
  const io = new Server(server, {
    allowEIO3: true,
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authenticate socket connection using JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = AuthService.decodeToken(token);
      socket.userId = payload.userId;
      next();
    } catch (err) {
      logger.error('Authentication error:', err);
      next(new Error('Authentication error')); // Pass error to next middleware
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Load previous messages when a new client connects
    Message.find({ userId: socket.userId }).then((messages) => {
      socket.emit('load messages', messages);
    });

    // Handle incoming chat messages
    socket.on('chat message', async ({ recipientId, message }) => {
      const newMessage = new Message({
        userId: socket.userId,
        recipient: recipientId,
        message,
      });
      await newMessage.save();
      io.emit('chat message', newMessage); // Broadcast the message to all clients
    });

    // Handle message deletion
    socket.on('delete message', async (messageId) => {
      await Message.findByIdAndDelete(messageId);
      io.emit('message deleted', messageId); // Notify clients about the deletion
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

export default setupSocket;
