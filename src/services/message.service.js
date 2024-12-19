import { InternalServerError } from '../errors/application-error.js';
import logger from '../logger/logger.js';
import Message from '../models/Message.js';

export default class MessageService {
  static createMessage = async (user, recipient, message) => {
    try {
      // Create and save the message
      const newMessage = await Message.create({
        user,
        recipient,
        message,
      });
      return newMessage;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to create Message');
    }
  };

  static fetchMessages = async (userId, recipientId) => {
    try {
      // Fetch messages between the two users
      const messages = await Message.find({
        $or: [
          { user: userId, recipient: recipientId },
          { user: recipientId, recipient: userId },
        ],
      })
        .populate('user', 'username email') // Populate sender details
        .populate('recipient', 'username email') // Populate recipient details
        .sort({ createdAt: 1 }); // Sort by oldest to newest

      return messages;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to fetch messages');
    }
  };

  static markMessagesAsRead = async (senderId, receiverId) => {
    try {
      // Update messages where the receiver matches and read is false
      await Message.updateMany(
        { sender: senderId, receiver: receiverId, read: false },
        { $set: { read: true } },
      );
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to change messages state to read');
    }
  };

  static deleteMessage = async (messageId) => {
    try {
      await Message.findByIdAndDelete(messageId);
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to delete message');
    }
  };
}
