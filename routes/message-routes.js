import express from 'express';
import {
  createMessage,
  getMessages,
  deleteMessage,
  markMessagesAsRead,
} from '../controllers/message-controller.js';

const router = express.Router();

// Create a message
router.post('/', createMessage);

// Get messages between two users
router.get('/get/:userId/:recepientId', getMessages);

// Read messages
router.get('/read/:userId/:recepientId', markMessagesAsRead);

// Delete a message
router.delete('/delete/:messageId', deleteMessage);

export default router;
