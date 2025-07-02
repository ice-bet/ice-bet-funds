import express from 'express';
import { sendMessage, getMessages, deleteMessage } from '../controllers/chatController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Send message
router.post('/send', verifyToken, sendMessage);
// Get messages for a room
router.get('/:room', verifyToken, getMessages);
// Admin deletes message
router.delete('/:id', verifyToken, isAdmin, deleteMessage);

export default router; 