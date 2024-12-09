import express from 'express';
import {
  createMessage,
  getMessages,
  deleteMessage,
} from '../controllers/message.controller.js';

const router = express.Router();

// Create a message
router.post('/', createMessage);

// Get messages between two users
router.get('/:userId/:recipientId', getMessages);

// Delete a message
router.delete('/:messageId', deleteMessage);

export default router;
