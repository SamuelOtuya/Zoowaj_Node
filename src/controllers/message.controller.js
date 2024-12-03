import { StatusCodes } from 'http-status-codes';
import Message from '../models/Message.js';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../errors/application-error.js';

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { user, recipient, message } = req.body;

    // Validate required fields
    if (!user || !recipient || !message) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'User, recipient, and message are required.' });
    }

    // Create and save the message
    const newMessage = await Message.create({
      user,
      recipient,
      message,
    });

    return res.status(StatusCodes.CREATED).json({ message: newMessage });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'An error occurred while sending the message.' });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId, recipientId } = req.params;

    // Validate required parameters
    if (!userId || !recipientId) {
      throw new BadRequestError('Both userId and recipientId are required');
    }

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

    return res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    console.error(error);
    throw new InternalServerError(
      'An error occurred while retrieving messages',
    );
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Validate the message ID
    if (!messageId) {
      throw new BadRequestError('Message ID is required');
    }

    // Delete the message
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      throw new NotFoundError('Message not found');
    }

    return res
      .status(StatusCodes.OK)
      .json({ msg: 'Message deleted successfully.' });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'An error occurred while deleting the message.' });
  }
};
