import { Server } from 'socket.io';
import logger from './logger/logger.js';
import AuthService from './services/auth.service.js';
import MessageService from './services/message.service.js';

const setupSocket = (server) => {
  const io = new Server(server, {
    allowEIO3: true,
    cors: {
      origin: '*',
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
      socket.user = payload.email;
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
        logger.debug(`Loading messages for user: ${socket.userId}`);

        const messages = await MessageService.fetchAllMessagesForUser(
          socket.userId,
        );
        logger.debug(`Retrieved ${messages.length} messages`);
        socket.emit('load messages', messages);
      } catch (error) {
        logger.error('Error loading messages:', error);
      }
    })();

    // Retrieve User's Chat messages with a Recipient
    socket.on('load chat', async (recipientId) => {
      try {
        logger.debug(
          `Loading chat for user: ${socket.user} with recipient: ${recipientId}`,
        );

        // Ensure recipientId is a string
        if (typeof recipientId !== 'string') {
          throw new Error('Invalid recipientId format');
        }

        const chatTexts = await MessageService.fetchChatMessagesBetweenUsers(
          socket.userId,
          recipientId,
        );

        if (!chatTexts) {
          logger.debug('No chat messages found. Returning empty array.');
          return socket.emit('load chat', []); // Send empty array if no messages
        }
        logger.debug(`Retrieved ${chatTexts.length} chat Texts`);
        socket.emit('load chat', chatTexts); // Send chat texts back to the client
      } catch (error) {
        logger.error('Error loading chat:', error.message);
        socket.emit('load chat error', 'Could not load chat messages');
      }
    });

    // Handle incoming chat messages
    socket.on('send text', async ({ recipientId, text }) => {
      try {
        logger.debug(
          `Sending messages from  ${socket.user} to user ${recipientId}`,
        );

        // Ensure recipientId is a string
        if (typeof recipientId !== 'string') {
          throw new Error('Invalid recipientId format');
        }

        const newMessage = await MessageService.createMessage(
          socket.userId,
          recipientId,
          text,
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
        logger.debug('deleting message');
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
