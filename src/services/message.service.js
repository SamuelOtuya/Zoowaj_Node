import { InternalServerError } from '../errors/application-error.js';
import logger from '../logger/logger.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

export default class MessageService {
  // Fetch all messages for a user with distinct recipients
  static fetchAllMessagesForUser = async (userId) => {
    try {
      const messages = await Message.find({
        $or: [{ userId }, { recipientId: userId }],
      })
        .populate('userId', 'username email') // Populate sender details
        .populate('recipientId', 'username email') // Populate recipient details
        .sort({ createdAt: 1 }); // Sort by oldest to newest
      if (!messages) return null;
      return messages;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to fetch messages');
    }
  };

  // Fetch chat texts between two users
  static fetchChatMessagesBetweenUsers = async (userId, recipientId) => {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

      const messages = await Message.find({
        $or: [
          { userId: userObjectId, recipientId: recipientObjectId },
          { userId: recipientObjectId, recipientId: userObjectId },
        ],
      })
        .populate('userId', 'username email') // Populate sender details
        .populate('recipientId', 'username email') // Populate recipient details
        .sort({ createdAt: -1 }); // Sort by oldest to newest

      return messages.length > 0 ? messages : null; // Return null if no messages found
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to fetch chat messages');
    }
  };

  // Create a new message
  static createMessage = async (userId, recipientId, text) => {
    try {
      const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

      const newMessage = await Message.create({
        userId,
        recipientId: recipientObjectId,
        text: text,
      });
      return newMessage;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to create message');
    }
  };

  // Update a specific message text
  static updateMessageText = async (messageId, newText) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { text: newText },
        { new: true }, // Return the updated document
      );

      if (!updatedMessage) {
        throw new InternalServerError('Message not found');
      }

      return updatedMessage;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to update message');
    }
  };

  // Mark messages as read
  static markMessagesAsRead = async (senderId, receiverId) => {
    try {
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
      const recipientObjectId = new mongoose.Types.ObjectId(receiverId);

      return await Message.updateMany(
        { userId: senderObjectId, recipientId: recipientObjectId, read: false },
        { $set: { read: true } },
      );
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to mark messages as read');
    }
  };

  // Delete a specific message by ID
  static deleteMessageById = async (messageId) => {
    try {
      const result = await Message.findByIdAndDelete(messageId);

      if (!result) {
        throw new InternalServerError('Message not found');
      }
      return;
    } catch (error) {
      logger.error(error);
      throw new InternalServerError('Unable to delete message');
    }
  };
}
