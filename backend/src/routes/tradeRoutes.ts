import express from 'express';
import { getPrices, buyTrade, sellTrade, getTradeHistory } from '../controllers/tradeController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/prices', getPrices);
router.post('/buy', protect, buyTrade);
router.post('/sell', protect, sellTrade);
router.get('/history', protect, getTradeHistory);

export default router;
