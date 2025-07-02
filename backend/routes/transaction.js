import express from 'express';
import {
  depositRequest,
  withdrawRequest,
  getPending,
  approveTransaction,
  declineTransaction,
  getHistory
} from '../controllers/transactionController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/deposit', verifyToken, depositRequest);
router.post('/withdraw', verifyToken, withdrawRequest);
router.get('/history', verifyToken, getHistory);

// Admin routes
router.get('/pending', verifyToken, isAdmin, getPending);
router.post('/approve/:id', verifyToken, isAdmin, approveTransaction);
router.post('/decline/:id', verifyToken, isAdmin, declineTransaction);

export default router; 