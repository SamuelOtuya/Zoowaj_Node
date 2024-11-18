import { StatusCodes } from "http-status-codes";
import Message from "../models/Message.js";

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { sender, recepient, message, encryptedKey } = req.body;

    // Validate required fields
    if (!sender || !recepient || !message) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Sender, recepient, encrypted message, and IV are required." });
    }

    // Create and save the encrypted message
    const newMessage = await Message.create({
      sender,
      recepient,
      message, // Encrypted message content
      encryptedKey, // Optional: Encrypted AES key
      // iv, // Initialization vector
    });

    return res.status(StatusCodes.CREATED).json({ message: newMessage });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred while sending the message." });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    // Validate required parameters
    if (!senderId || !recepientId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Both senderId and recepientId are required." });
    }

    // Fetch encrypted messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: senderId, recepient: recepientId },
        { sender: recepientId, recepient: senderId },
      ],
    })
      .populate("sender", "username email") // Populate sender details
      .populate("recepient", "username email") // Populate recipient details
      .sort({ createdAt: 1 }); // Sort by oldest to newest

    return res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred while retrieving messages." });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Validate the message ID
    if (!messageId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Message ID is required." });
    }

    // Delete the message
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Message not found." });
    }

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Message deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred while deleting the message." });
  }
};
