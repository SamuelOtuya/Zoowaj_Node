import express from 'express';
import {
  createMessage,
  getMessages,
  deleteMessage,
  markMessagesAsRead,
} from '../controllers/message.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create a message
router.post('/', authMiddleware, createMessage);

// Get messages between two users
router.get('/get/:userId/:recipientId', authMiddleware, getMessages);

// Read messages
router.get('/read/:userId/:recipientId', authMiddleware, markMessagesAsRead);

// Delete a message
router.delete('/delete/:messageId', authMiddleware, deleteMessage);

export default router;
