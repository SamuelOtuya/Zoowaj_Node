import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/application-error.js';
import MessageService from '../services/message.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// Create a new message
export const createMessage = asyncHandler(async (req, res) => {
  const { userId, recipientId, text } = req.body;

  // Validate required fields
  if (!userId || !recipientId || !text) {
    throw new BadRequestError('User, recipient, and message are required.');
  }
  const newMessage = await MessageService.createMessage(
    userId,
    recipientId,
    text,
  );

  return res.status(StatusCodes.CREATED).json({ message: newMessage });
});

// Get messages between two users
export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate required parameters
  if (!userId) {
    throw new BadRequestError('Both userId and recipientId are required');
  }

  const messages = await MessageService.fetchAllMessagesForUser(userId);

  return res.status(StatusCodes.OK).json({ messages });
});

// Get messages between two users
export const getChats = asyncHandler(async (req, res) => {
  const { userId, recipientId } = req.params;

  // Validate required parameters
  if (!userId || !recipientId) {
    throw new BadRequestError('Both userId and recipientId are required');
  }

  const messages = await MessageService.fetchChatMessagesBetweenUsers(userId, recipientId);

  return res.status(StatusCodes.OK).json({ messages });
});

// Mark messages as read
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { senderId, receiverId } = req.body;

  await MessageService.markMessagesAsRead(senderId, receiverId);

  res.status(200).json({ msg: 'Messages marked as read' });
});

// Delete a message
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  // Validate the message ID
  if (!messageId) {
    throw new BadRequestError('Message ID is required');
  }
  await MessageService.deleteMessageById(messageId);

  return res
    .status(StatusCodes.OK)
    .json({ msg: 'Message deleted successfully' });
});
