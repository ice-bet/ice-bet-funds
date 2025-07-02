import express from 'express';
import {
  invest,
  withdrawEarly,
  matureInvestment,
  getMyInvestments,
  getAllInvestments
} from '../controllers/investmentController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/invest', verifyToken, invest);
router.post('/withdraw/:id', verifyToken, withdrawEarly);
router.get('/my', verifyToken, getMyInvestments);

// Admin routes
router.get('/all', verifyToken, isAdmin, getAllInvestments);
router.post('/mature/:id', verifyToken, isAdmin, matureInvestment);

export default router; 