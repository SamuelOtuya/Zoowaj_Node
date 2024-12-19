import { Server } from 'socket.io';
import logger from './logger/logger.js';
import AuthService from './services/auth.service.js';
import MessageService from './services/message.service.js';

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
      socket.userId = payload.userId; // Assuming payload contains userId
      next();
    } catch (err) {
      logger.error('Authentication error:', err);
      next(new Error('Authentication error')); // Pass error to next middleware
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Load previous messages when a new client connects
    (async () => {
      try {
        const messages = await MessageService.fetchAllMessagesForUser(
          socket.userId,
        );
        socket.emit('load messages', messages);
      } catch (error) {
        logger.error('Error loading messages:', error);
      }
    })();

    // Retrieve User's Chat messages with a Recipient
    socket.on('load chat', async ({ recipientId }) => {
      try {
        const chatTexts = await MessageService.fetchChatMessagesBetweenUsers(
          socket.userId,
          recipientId,
        );
        socket.emit('load chat', chatTexts); // Send chat texts back to the requesting client
      } catch (error) {
        logger.error('Error loading chat:', error);
        socket.emit('load chat error', 'Could not load chat messages');
      }
    });

    // Handle incoming chat messages
    socket.on('send text', async ({ recipientId, message }) => {
      try {
        const newMessage = await MessageService.createMessage(
          socket.userId,
          recipientId,
          message,
        );
        io.emit('send text', newMessage); // Broadcast the message to all clients
      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('send text error', 'Could not send message');
      }
    });

    // Handle message deletion
    socket.on('delete text', async (messageId) => {
      try {
        await MessageService.deleteMessageById(messageId);
        io.emit('message deleted', messageId); // Notify clients about the deletion
      } catch (error) {
        logger.error('Error deleting message:', error);
        socket.emit('delete text error', 'Could not delete message');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

export default setupSocket;
