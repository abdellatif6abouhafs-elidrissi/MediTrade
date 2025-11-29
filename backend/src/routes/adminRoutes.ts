import express from 'express';
import { getAllUsers, deleteUser, getStats } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);
router.get('/stats', getStats);

export default router;
