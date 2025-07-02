import express from 'express';
import { getReferralStatus, getAllReferrals } from '../controllers/referralController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User route
router.get('/status', verifyToken, getReferralStatus);

// Admin route
router.get('/all', verifyToken, isAdmin, getAllReferrals);

export default router; 