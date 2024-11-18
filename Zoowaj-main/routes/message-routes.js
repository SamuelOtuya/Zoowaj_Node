import express from "express";
import { createMessage, getMessages, deleteMessage } from "../controllers/message-controller.js";

const router = express.Router();

// Create a message (encrypted content is sent from the client)
router.post("/", createMessage);

// Get messages between two users (returns encrypted content)
router.get("/:senderId/:recepientId", getMessages);

// Delete a message (delete by ID)
router.delete("/:messageId", deleteMessage);

export default router;
