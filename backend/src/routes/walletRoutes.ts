import express from 'express';
import { getWallet, deposit, withdraw } from '../controllers/walletController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getWallet);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);

export default router;
