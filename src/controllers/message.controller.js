import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/application-error.js';
import MessageService from '../services/message.service.js';

// Create a new message
export const createMessage = async (req, res) => {
  const { user, recipient, message } = req.body;

  // Validate required fields
  if (!user || !recipient || !message) {
    throw new BadRequestError('User, recipient, and message are required.');
  }
  const newMessage = await MessageService.createMessage(
    user,
    recipient,
    message,
  );

  return res.status(StatusCodes.CREATED).json({ message: newMessage });
};

// Get messages between two users
export const getMessages = async (req, res) => {
  const { userId, recipientId } = req.params;

  // Validate required parameters
  if (!userId || !recipientId) {
    throw new BadRequestError('Both userId and recipientId are required');
  }

  const messages = await MessageService.fetchMessages(userId, recipientId);

  return res.status(StatusCodes.OK).json({ messages });
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  const { senderId, receiverId } = req.body;

  await MessageService.markMessagesAsRead(senderId, receiverId);

  res.status(200).json({ msg: 'Messages marked as read' });
};

// Delete a message
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  // Validate the message ID
  if (!messageId) {
    throw new BadRequestError('Message ID is required');
  }
  await MessageService.deleteMessage(messageId);

  return res
    .status(StatusCodes.OK)
    .json({ msg: 'Message deleted successfully' });
};
