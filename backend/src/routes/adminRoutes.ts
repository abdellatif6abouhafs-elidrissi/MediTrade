import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUser,
  getStats,
  getAllTrades,
  getAllTransactions,
  getRecentActivity,
  deleteTrade,
  deleteTransaction
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

// Stats and activity
router.get('/stats', getStats);
router.get('/activity', getRecentActivity);

// Trade management
router.get('/trades', getAllTrades);
router.delete('/trade/:id', deleteTrade);

// Transaction management
router.get('/transactions', getAllTransactions);
router.delete('/transaction/:id', deleteTransaction);

export default router;
